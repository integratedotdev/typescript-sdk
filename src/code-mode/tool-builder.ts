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

export const CODE_MODE_TOOL_NAME = "execute_code";

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

const DEFAULT_INSTRUCTIONS = [
  "You are given a single tool: `execute_code`. Instead of calling individual MCP tools,",
  "you write a short async TypeScript/JavaScript snippet that uses the typed `client`",
  "object below, and the snippet runs in an isolated sandbox which dispatches the actual",
  "tool calls. Chain multiple operations together in one snippet whenever possible —",
  "that is the whole point of this tool.",
  "",
  "Rules:",
  "- The snippet is the body of an `async` function. Use `await` freely.",
  "- Use `return <value>` at the end to hand a structured result back to the caller;",
  "  the caller receives it as JSON.",
  "- Use `console.log(...)` for intermediate observations you want to read later.",
  "- Throw / let errors propagate; the runtime will surface them with a non-zero exit.",
  "- Each method call returns an object of shape `ToolResult` (see types below).",
  "  The payload usually lives in `result.content[0].text` as JSON — parse it if needed.",
  "- You cannot import npm packages. Only the pre-imported `client` and standard",
  "  globals (`fetch`, `console`, `JSON`, ...) are available.",
  "",
  "API surface:",
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
 * Build the `execute_code` tool definition. The returned `execute` function
 * is what the AI provider SDK ultimately invokes when the model picks the
 * tool.
 */
export function buildCodeModeTool(
  client: MCPClient<any>,
  options: CodeModeToolOptions
): CodeModeToolDefinition {
  const { tools, providerTokens, context, integrationIds } = options;

  const generated = generateCodeModeTypes(tools);

  const serverCodeModeConfig = resolveCodeModeClientConfig(client);
  const sandboxOverrides = options.sandbox ?? {};

  const description = `${DEFAULT_INSTRUCTIONS}\n\n\`\`\`typescript\n${generated.source}\n\`\`\``;

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

    return executeSandboxCode({
      code,
      mcpUrl,
      apiKey,
      providerTokens,
      context,
      integrationsHeader: integrationIds && integrationIds.length > 0 ? integrationIds.join(",") : undefined,
      runtime: sandboxOverrides.runtime ?? serverCodeModeConfig.runtime,
      timeoutMs: sandboxOverrides.timeoutMs ?? serverCodeModeConfig.timeoutMs,
      vcpus: sandboxOverrides.vcpus ?? serverCodeModeConfig.vcpus,
      networkPolicy: sandboxOverrides.networkPolicy ?? serverCodeModeConfig.networkPolicy,
    });
  };

  return {
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
}
