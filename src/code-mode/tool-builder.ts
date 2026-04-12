/**
 * Code Mode: shared `execute_code` tool builder
 *
 * Used by every AI helper (`getVercelAITools`, `getOpenAITools`,
 * `getAnthropicTools`, `getGoogleTools`) so that when Code Mode is the
 * selected mode they return a single `execute_code` tool instead of one
 * tool per MCP entry. Each helper wraps the returned `execute` into its
 * own SDK-specific tool envelope.
 */

import type { MCPClient } from "../client.js";
import type { MCPContext } from "../config/types.js";
import type { MCPTool } from "../protocol/messages.js";
import { generateCodeModeTypes } from "./type-generator.js";
import {
  executeSandboxCode,
  isSandboxAvailable,
  getSandboxImportError,
  type ExecuteSandboxCodeResult,
} from "./executor.js";
import { getEnv } from "../utils/env.js";
import { getProviderTokens } from "../utils/request-tokens.js";

export const CODE_MODE_TOOL_NAME = "execute_code";
export const TYPES_TOOL_NAME = "get_integration_types";

export interface CodeModeToolOptions {
  /** Enabled MCP tools (already fetched by the caller). */
  tools: MCPTool[];
  /** Provider tokens to forward to the sandbox. */
  providerTokens?: Record<string, string>;
  /** Multi-tenant user context. */
  context?: MCPContext;
  /**
   * Integration IDs enabled on this client (comma-separated or array).
   * Forwarded as `x-integrations` so the MCP server can scope tool dispatch.
   */
  integrationIds?: string[];
  /**
   * Sandbox + callback overrides. Everything is optional — defaults come
   * from the server client's `__oauthConfig.codeMode` block (set by
   * `createMCPServer`) or from `INTEGRATE_URL`.
   */
  sandbox?: {
    publicUrl?: string;
    runtime?: "node24" | "node22";
    timeoutMs?: number;
    vcpus?: number;
    networkPolicy?: "allow-all" | "deny-all" | { allow?: string[]; subnets?: { allow?: string[]; deny?: string[] } };
  };
}

export interface CodeModeToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: {
      code: { type: "string"; description: string };
    };
    required: ["code"];
    additionalProperties: false;
  };
  execute: (input: { code: string }) => Promise<ExecuteSandboxCodeResult>;
}

export interface TypesToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: {
      integration: { type: "string"; description: string };
    };
    required: ["integration"];
    additionalProperties: false;
  };
  execute: (input: { integration: string }) => { types: string } | { error: string; available: string[] };
}

export interface CodeModeTools {
  codeTool: CodeModeToolDefinition;
  typesTool: TypesToolDefinition;
}

const DEFAULT_INSTRUCTIONS = [
  "Write an async JS/TS snippet that runs in an isolated sandbox using `client.<integration>.<method>(args)`.",
  "Chain multiple operations in one snippet. Use `await`, `return <value>` for JSON output, `console.log()` for debug.",
  "Each method returns `ToolResult { content: [{ type, text? }], isError? }` — parse `result.content[0].text` as JSON.",
  "Only `client`, `callTool`, `fetch`, `console`, `JSON` are available (no npm imports).",
  "",
  "Call `get_integration_types` with an integration name to get full parameter types before writing code.",
  "",
  "Available methods:",
].join("\n");

export function resolveCodeModeClientConfig(client: MCPClient<any>): {
  publicUrl?: string;
  runtime?: "node24" | "node22";
  timeoutMs?: number;
  vcpus?: number;
  networkPolicy?: "allow-all" | "deny-all" | { allow?: string[]; subnets?: { allow?: string[]; deny?: string[] } };
} {
  const oauthConfig = (client as any).__oauthConfig;
  return (oauthConfig?.codeMode ?? {}) as Record<string, any>;
}

export type CodeModeUnavailableReason = "sandbox-missing" | "no-public-url";

export type CodeModeDiagnosis =
  | { available: true }
  | { available: false; reason: CodeModeUnavailableReason };

/**
 * Resolve the public URL the sandbox should call back into. Precedence:
 *   1. Explicit `codeMode.publicUrl` on the server config
 *   2. `INTEGRATE_URL` env var (same variable used for OAuth redirect auto-detect)
 */
export function resolveCodeModePublicUrl(
  serverConfig: { publicUrl?: string } = {},
): string | undefined {
  return serverConfig.publicUrl ?? getEnv("INTEGRATE_URL");
}

export async function diagnoseCodeMode(client: MCPClient<any>): Promise<CodeModeDiagnosis> {
  if (!(await isSandboxAvailable())) {
    return { available: false, reason: "sandbox-missing" };
  }
  const serverConfig = resolveCodeModeClientConfig(client);
  const publicUrl = resolveCodeModePublicUrl(serverConfig);
  if (!publicUrl) {
    return { available: false, reason: "no-public-url" };
  }
  return { available: true };
}

export async function canUseCodeMode(client: MCPClient<any>): Promise<boolean> {
  return (await diagnoseCodeMode(client)).available;
}

function buildFallbackMessage(reason: CodeModeUnavailableReason): string {
  if (reason === "no-public-url") {
    return (
      "[integrate-sdk] Code Mode unavailable (reason: no-public-url) — falling back to tool mode. " +
      "Set `codeMode.publicUrl` on your server config or the `INTEGRATE_URL` env var."
    );
  }
  const importError = getSandboxImportError();
  const detail = importError instanceof Error
    ? ` Underlying import error: ${importError.message}`
    : importError
      ? ` Underlying import error: ${String(importError)}`
      : "";
  return (
    "[integrate-sdk] Code Mode unavailable (reason: sandbox-missing) — falling back to tool mode. " +
    "Ensure `@vercel/sandbox` is in `dependencies` and the route runs in the Node.js runtime (not Edge)." +
    detail
  );
}

const warnedCodeModeReasons = new Set<CodeModeUnavailableReason>();

/** @internal — used by unit tests to reset the warn-once throttle. */
export function __resetCodeModeFallbackWarnings(): void {
  warnedCodeModeReasons.clear();
}

/**
 * Called by AI helpers when auto-detection picks `tools` mode. Emits a
 * throttled `console.warn` so operators can tell *why* Code Mode was
 * silently downgraded. Each reason warns at most once per process.
 */
export function warnCodeModeFallback(reason: CodeModeUnavailableReason): void {
  if (warnedCodeModeReasons.has(reason)) return;
  warnedCodeModeReasons.add(reason);
  console.warn(buildFallbackMessage(reason));
}

/**
 * Build the `execute_code` and `get_integration_types` tool definitions.
 * The compact method listing goes in execute_code's description; full
 * TypeScript types are served on demand via get_integration_types.
 */
export function buildCodeModeTool(
  client: MCPClient<any>,
  options: CodeModeToolOptions
): CodeModeTools {
  const { tools, providerTokens, context, integrationIds } = options;

  const generated = generateCodeModeTypes(tools);

  const serverCodeModeConfig = resolveCodeModeClientConfig(client);
  const sandboxOverrides = options.sandbox ?? {};

  const description = `${DEFAULT_INSTRUCTIONS}\n${generated.compact}`;

  const execute = async ({ code }: { code: string }): Promise<ExecuteSandboxCodeResult> => {
    const publicUrl = resolveCodeModePublicUrl({
      publicUrl: sandboxOverrides.publicUrl ?? serverCodeModeConfig.publicUrl,
    });
    const apiKey = (client as any).__oauthConfig?.apiKey as string | undefined;

    if (!publicUrl) {
      return {
        success: false,
        exitCode: -1,
        stdout: "",
        stderr: "",
        durationMs: 0,
        error:
          "Code Mode requires `codeMode.publicUrl` in createMCPServer config (or the INTEGRATE_URL env var). " +
          "The sandbox uses it to call back into /api/integrate/mcp.",
      };
    }

    const mcpUrl = publicUrl.replace(/\/$/, "") + "/api/integrate/mcp";

    // Resolve provider tokens at execute time using a three-tier fallback:
    //   1. Build-time tokens (captured when getVercelAITools/etc. was called)
    //   2. Request-header extraction (x-integrate-tokens via next/headers() at execute time)
    //   3. OAuthManager DB callbacks (getProviderToken from createMCPServer config)
    //
    // Tier 2 is critical: if the developer's route handler caches the tools object
    // or calls getVercelAITools() outside the request scope, build-time tokens are
    // empty. But execute() still runs inside the request, so next/headers() works.
    let resolvedTokens = providerTokens;
    let tokenSource: string = resolvedTokens && Object.keys(resolvedTokens).length > 0 ? "build-time" : "none";

    // Tier 2: try request-header extraction at execute time
    if (!resolvedTokens || Object.keys(resolvedTokens).length === 0) {
      try {
        resolvedTokens = await getProviderTokens();
        if (resolvedTokens && Object.keys(resolvedTokens).length > 0) {
          tokenSource = "request-header";
        }
      } catch {
        // No request context or no header — continue to tier 3
      }
    }

    // Tier 3: resolve from the client's oauthManager (DB callbacks / memory cache)
    if (!resolvedTokens || Object.keys(resolvedTokens).length === 0) {
      const oauthManager = (client as any).oauthManager;
      if (oauthManager) {
        resolvedTokens = {};
        const clientIntegrations: Array<{ oauth?: { provider: string } }> = (client as any).integrations || [];
        for (const integration of clientIntegrations) {
          if (integration.oauth) {
            const provider = integration.oauth.provider;
            try {
              const tokenData = await oauthManager.getProviderToken(provider, undefined, context);
              if (tokenData?.accessToken) {
                resolvedTokens[provider] = tokenData.accessToken;
              }
            } catch {
              // Skip providers with no tokens
            }
          }
        }
        if (Object.keys(resolvedTokens).length === 0) {
          resolvedTokens = undefined;
        } else {
          tokenSource = "oauthManager";
        }
      }
    }

    console.debug(
      "[integrate-sdk] execute_code token resolution:",
      JSON.stringify({
        source: tokenSource,
        keys: resolvedTokens ? Object.keys(resolvedTokens) : [],
        hasApiKey: !!apiKey,
        mcpUrl,
      })
    );

    return executeSandboxCode({
      code,
      mcpUrl,
      apiKey,
      providerTokens: resolvedTokens,
      context,
      integrationsHeader: integrationIds && integrationIds.length > 0 ? integrationIds.join(",") : undefined,
      runtime: sandboxOverrides.runtime ?? serverCodeModeConfig.runtime,
      timeoutMs: sandboxOverrides.timeoutMs ?? serverCodeModeConfig.timeoutMs,
      vcpus: sandboxOverrides.vcpus ?? serverCodeModeConfig.vcpus,
      networkPolicy: sandboxOverrides.networkPolicy ?? serverCodeModeConfig.networkPolicy,
    });
  };

  const availableIntegrations = Object.keys(generated.perIntegration);

  const codeTool: CodeModeToolDefinition = {
    name: CODE_MODE_TOOL_NAME,
    description,
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description:
            "The TypeScript/JavaScript snippet to execute. It is wrapped in an async IIFE, so you may use top-level await and return a final value.",
        },
      },
      required: ["code"],
      additionalProperties: false,
    },
    execute,
  };

  const typesTool: TypesToolDefinition = {
    name: TYPES_TOOL_NAME,
    description:
      "Get full TypeScript type definitions (method signatures, parameter types, JSDoc) for a specific integration. " +
      `Available integrations: ${availableIntegrations.join(", ")}.`,
    parameters: {
      type: "object",
      properties: {
        integration: {
          type: "string",
          description: `Integration name to get types for (${availableIntegrations.join(", ")}).`,
        },
      },
      required: ["integration"],
      additionalProperties: false,
    },
    execute: ({ integration }: { integration: string }) => {
      const types = generated.perIntegration[integration];
      if (!types) {
        return { error: `Unknown integration "${integration}".`, available: availableIntegrations };
      }
      return { types };
    },
  };

  return { codeTool, typesTool };
}
