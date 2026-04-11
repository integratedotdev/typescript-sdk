/**
 * Code Mode: Vercel Sandbox executor
 *
 * Spins up a Vercel Sandbox microVM per `execute_code` call, writes the
 * runtime stub and wrapped user code into it, runs node against the user
 * code, and returns captured stdout/stderr + parsed result.
 *
 * `@vercel/sandbox` is loaded lazily so importing code-mode utilities on the
 * client / from the type generator does not force the dependency to exist.
 */

import type { MCPContext } from "../config/types.js";
import { RUNTIME_STUB_SOURCE } from "./runtime-stub.js";

/**
 * Shape the executor depends on — mirrors the subset of `@vercel/sandbox`
 * we actually use. Declared structurally so we don't force the real package
 * to be installed at type-check time.
 */
interface SandboxLike {
  writeFiles(files: Array<{ path: string; content: Buffer }>): Promise<void>;
  runCommand(
    params: {
      cmd: string;
      args?: string[];
      env?: Record<string, string>;
      cwd?: string;
    }
  ): Promise<{
    exitCode: number;
    stdout(): Promise<string>;
    stderr(): Promise<string>;
  }>;
  stop(): Promise<unknown>;
}

interface SandboxFactory {
  create(options: {
    runtime?: string;
    timeout?: number;
    resources?: { vcpus?: number };
    networkPolicy?: unknown;
  }): Promise<SandboxLike>;
}

/**
 * Test seam: tests can inject a fake `@vercel/sandbox` module instead of
 * forcing the real package to be installed.
 */
let sandboxFactoryOverride: SandboxFactory | null = null;
let _sandboxAvailableCache: boolean | null = null;
let _sandboxForcedUnavailableForTests = false;

/** @internal — used by unit tests to stub the sandbox SDK. */
export function __setSandboxFactoryForTests(factory: SandboxFactory | null): void {
  sandboxFactoryOverride = factory;
  _sandboxForcedUnavailableForTests = false;
  _sandboxAvailableCache = null;
}

/** @internal — used by unit tests to simulate missing @vercel/sandbox. */
export function __setSandboxUnavailableForTests(force: boolean): void {
  _sandboxForcedUnavailableForTests = force;
  _sandboxAvailableCache = null;
}

export async function isSandboxAvailable(): Promise<boolean> {
  if (_sandboxAvailableCache !== null) return _sandboxAvailableCache;
  if (_sandboxForcedUnavailableForTests) {
    _sandboxAvailableCache = false;
    return false;
  }
  if (sandboxFactoryOverride) {
    _sandboxAvailableCache = true;
    return true;
  }
  try {
    const dynamicImport = new Function("specifier", "return import(specifier)") as (s: string) => Promise<any>;
    await dynamicImport("@" + "vercel/sandbox");
    _sandboxAvailableCache = true;
    return true;
  } catch {
    _sandboxAvailableCache = false;
    return false;
  }
}

async function loadSandboxFactory(): Promise<SandboxFactory> {
  if (sandboxFactoryOverride) return sandboxFactoryOverride;
  try {
    // Hide the dynamic import from bundlers so the optional dep isn't statically resolved.
    const dynamicImport = new Function("specifier", "return import(specifier)") as (s: string) => Promise<any>;
    const pkg = "@" + "vercel/sandbox";
    const mod = await dynamicImport(pkg);
    return mod.Sandbox ?? mod.default?.Sandbox ?? mod;
  } catch (err) {
    throw new Error(
      "Code Mode requires the optional peer dependency `@vercel/sandbox`. " +
      "Install it with `npm install @vercel/sandbox` (or `bun add @vercel/sandbox`)."
    );
  }
}

export interface ExecuteSandboxCodeOptions {
  /** Source code the LLM produced. Treated as an async function body. */
  code: string;
  /** Fully-qualified MCP route URL, e.g. `https://myapp.com/api/integrate/mcp`. */
  mcpUrl: string;
  /** Server API key forwarded to trusted sandbox callbacks. */
  apiKey?: string;
  /** Session token forwarded as `Authorization: Bearer <token>` by the stub. */
  sessionToken?: string;
  /**
   * Provider OAuth tokens to forward as `x-integrate-tokens`. Same format the
   * existing AI helpers pass to the `/api/integrate/mcp` route today.
   */
  providerTokens?: Record<string, string>;
  /** Comma-separated integration IDs (forwarded as `x-integrations`). */
  integrationsHeader?: string;
  /** Optional multi-tenant user context. Serialized to JSON for the sandbox. */
  context?: MCPContext;
  /** Sandbox runtime image. Defaults to `'node22'`. */
  runtime?: "node24" | "node22";
  /** Sandbox timeout in ms. Defaults to 60_000. */
  timeoutMs?: number;
  /** vCPUs allocated to the sandbox. Defaults to 2. */
  vcpus?: number;
  /** Egress firewall. Defaults to an allow-list containing only the MCP host. */
  networkPolicy?: "allow-all" | "deny-all" | { allow?: string[]; subnets?: { allow?: string[]; deny?: string[] } };
}

export interface ExecuteSandboxCodeResult {
  /** Whether the sandbox command exited with code 0. */
  success: boolean;
  /** Exit code from `node user.mjs`. */
  exitCode: number;
  /** Parsed return value, if the user code set one via `return`. */
  result?: unknown;
  /** Raw stdout stream (without the `__INTEGRATE_RESULT__` sentinel line). */
  stdout: string;
  /** Raw stderr stream. */
  stderr: string;
  /** Wall-clock duration in milliseconds. */
  durationMs: number;
  /** Error message if the sandbox itself failed (not user-code exit != 0). */
  error?: string;
}

const RESULT_SENTINEL = "__INTEGRATE_RESULT__";

/**
 * Wrap raw LLM-authored code so we can capture a return value and surface
 * errors as non-zero exit codes. The inner IIFE is an async arrow so the LLM
 * can use `await`, top-level `return`, etc.
 */
function wrapUserCode(code: string): string {
  return `// user.mjs — wrapped by integrate-sdk code mode
import { client, callTool } from './runtime.mjs';

(async () => {
  try {
    const __result = await (async () => {
${code}
    })();
    if (typeof __result !== 'undefined') {
      process.stdout.write('\\n' + ${JSON.stringify(RESULT_SENTINEL)} + JSON.stringify(__result) + '\\n');
    }
  } catch (err) {
    const payload = {
      message: err && err.message ? err.message : String(err),
      name: err && err.name,
      stack: err && err.stack,
      toolName: err && err.toolName,
      status: err && err.status,
    };
    process.stderr.write('\\n' + ${JSON.stringify(RESULT_SENTINEL)} + JSON.stringify({ error: payload }) + '\\n');
    process.exit(1);
  }
})();
`;
}

function defaultNetworkPolicy(mcpUrl: string): { allow: string[] } {
  try {
    const host = new URL(mcpUrl).hostname;
    return { allow: [host] };
  } catch {
    return { allow: [] };
  }
}

function extractResult(stream: string): { cleaned: string; result?: unknown } {
  const idx = stream.lastIndexOf(RESULT_SENTINEL);
  if (idx === -1) return { cleaned: stream };
  const before = stream.slice(0, idx).replace(/\n$/, "");
  const rest = stream.slice(idx + RESULT_SENTINEL.length);
  const newlineIdx = rest.indexOf("\n");
  const payload = newlineIdx === -1 ? rest : rest.slice(0, newlineIdx);
  const after = newlineIdx === -1 ? "" : rest.slice(newlineIdx + 1);
  try {
    return { cleaned: (before + after).trimEnd(), result: JSON.parse(payload) };
  } catch {
    return { cleaned: stream };
  }
}

/**
 * Execute LLM-authored TypeScript/JS code inside a fresh Vercel Sandbox.
 * Creates one sandbox per call and stops it in `finally`.
 */
export async function executeSandboxCode(options: ExecuteSandboxCodeOptions): Promise<ExecuteSandboxCodeResult> {
  const startedAt = Date.now();
  const runtime = options.runtime ?? "node22";
  const timeoutMs = options.timeoutMs ?? 60_000;
  const networkPolicy = options.networkPolicy ?? defaultNetworkPolicy(options.mcpUrl);

  let sandbox: SandboxLike | null = null;
  try {
    const Sandbox = await loadSandboxFactory();
    sandbox = await Sandbox.create({
      runtime,
      timeout: timeoutMs,
      resources: options.vcpus ? { vcpus: options.vcpus } : undefined,
      networkPolicy,
    });

    const runtimeContent = Buffer.from(RUNTIME_STUB_SOURCE, "utf-8");
    const userContent = Buffer.from(wrapUserCode(options.code), "utf-8");
    await sandbox.writeFiles([
      { path: "runtime.mjs", content: runtimeContent },
      { path: "user.mjs", content: userContent },
    ]);

    const env: Record<string, string> = {
      INTEGRATE_MCP_URL: options.mcpUrl,
    };
    if (options.apiKey) env.INTEGRATE_API_KEY = options.apiKey;
    if (options.sessionToken) env.INTEGRATE_SESSION_TOKEN = options.sessionToken;
    if (options.providerTokens && Object.keys(options.providerTokens).length > 0) {
      env.INTEGRATE_PROVIDER_TOKENS = JSON.stringify(options.providerTokens);
    }
    if (options.integrationsHeader) env.INTEGRATE_INTEGRATIONS = options.integrationsHeader;
    if (options.context) env.INTEGRATE_CONTEXT = JSON.stringify(options.context);

    const cmd = await sandbox.runCommand({
      cmd: "node",
      args: ["user.mjs"],
      env,
    });

    const [stdoutRaw, stderrRaw] = await Promise.all([cmd.stdout(), cmd.stderr()]);
    const stdoutExtract = extractResult(stdoutRaw);
    const stderrExtract = extractResult(stderrRaw);

    return {
      success: cmd.exitCode === 0,
      exitCode: cmd.exitCode,
      result: stdoutExtract.result ?? stderrExtract.result,
      stdout: stdoutExtract.cleaned,
      stderr: stderrExtract.cleaned,
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    return {
      success: false,
      exitCode: -1,
      stdout: "",
      stderr: "",
      durationMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    if (sandbox) {
      try {
        await sandbox.stop();
      } catch {
        // Swallow stop errors — the sandbox may already be terminating.
      }
    }
  }
}
