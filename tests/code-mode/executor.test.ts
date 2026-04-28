/**
 * Tests for the Code Mode Vercel Sandbox executor.
 *
 * These use the `__setSandboxFactoryForTests` seam so we never touch the
 * real `@vercel/sandbox` peer dep.
 */

import { describe, test, expect, afterEach, mock } from "bun:test";
import {
  executeSandboxCode,
  __setSandboxFactoryForTests,
  __setSandboxUnavailableForTests,
  isSandboxAvailable,
} from "../../src/code-mode/executor.js";
import { RUNTIME_STUB_SOURCE } from "../../src/code-mode/runtime-stub.js";

interface RecordedCommand {
  cmd: string;
  args?: string[];
  env?: Record<string, string>;
}

function makeFakeSandbox(opts: {
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  createError?: Error;
  writeFilesError?: Error;
} = {}) {
  const recordedFiles: Array<{ path: string; content: string }> = [];
  const recordedCommands: RecordedCommand[] = [];
  let createCalls = 0;
  let stopCalls = 0;

  const factory = {
    async create(createOptions: any) {
      createCalls++;
      if (opts.createError) throw opts.createError;
      return {
        async writeFiles(files: Array<{ path: string; content: Buffer }>) {
          if (opts.writeFilesError) throw opts.writeFilesError;
          for (const f of files) {
            recordedFiles.push({ path: f.path, content: f.content.toString("utf-8") });
          }
        },
        async runCommand(params: RecordedCommand) {
          recordedCommands.push(params);
          return {
            exitCode: opts.exitCode ?? 0,
            stdout: async () => opts.stdout ?? "",
            stderr: async () => opts.stderr ?? "",
          };
        },
        async stop() {
          stopCalls++;
        },
      };
    },
    getCreateCalls: () => createCalls,
    getStopCalls: () => stopCalls,
    getRecordedFiles: () => recordedFiles,
    getRecordedCommands: () => recordedCommands,
  } as any;

  return factory;
}

async function importRuntimeStub(): Promise<any> {
  const source = RUNTIME_STUB_SOURCE
    .replace("export const client = new Proxy", "const client = new Proxy")
    .replace("export { callTool };", "return { client, callTool };");
  return new Function("process", "fetch", source)(process, global.fetch);
}

describe("executeSandboxCode", () => {
  afterEach(() => {
    __setSandboxFactoryForTests(null);
    __setSandboxUnavailableForTests(false);
  });

  test("reports sandbox as available when a test factory override is set", async () => {
    __setSandboxFactoryForTests(makeFakeSandbox());

    await expect(isSandboxAvailable()).resolves.toBe(true);
  });

  test("reports sandbox as unavailable when forced unavailable for tests", async () => {
    __setSandboxUnavailableForTests(true);

    await expect(isSandboxAvailable()).resolves.toBe(false);
  });

  test("resets the sandbox availability cache when the test override changes", async () => {
    __setSandboxUnavailableForTests(true);
    await expect(isSandboxAvailable()).resolves.toBe(false);

    __setSandboxFactoryForTests(makeFakeSandbox());
    await expect(isSandboxAvailable()).resolves.toBe(true);

    __setSandboxUnavailableForTests(true);
    await expect(isSandboxAvailable()).resolves.toBe(false);
  });

  test("writes runtime stub + wrapped user code and runs node user.mjs", async () => {
    const fake = makeFakeSandbox({
      stdout: 'hello\n__INTEGRATE_RESULT__{"ok":true}\n',
    });
    __setSandboxFactoryForTests(fake);

    const result = await executeSandboxCode({
      code: "return { ok: true };",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
    });

    expect(result.success).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual({ ok: true });
    expect(result.stdout).toBe("hello");

    const files = fake.getRecordedFiles();
    expect(files.map((f: any) => f.path).sort()).toEqual(["runtime.mjs", "user.mjs"]);
    const runtimeFile = files.find((f: any) => f.path === "runtime.mjs")!;
    const userFile = files.find((f: any) => f.path === "user.mjs")!;
    expect(runtimeFile.content).toContain("const API_KEY = process.env.INTEGRATE_API_KEY || '';");
    expect(runtimeFile.content).toContain("headers['x-integrate-api-key'] = API_KEY;");
    expect(userFile.content).toContain("return { ok: true };");
    expect(userFile.content).toContain("import { client");

    const commands = fake.getRecordedCommands();
    expect(commands).toHaveLength(1);
    expect(commands[0].cmd).toBe("node");
    expect(commands[0].args).toEqual(["user.mjs"]);
  });

  test("forwards MCP URL, API key, tokens, integrations, and context as env vars", async () => {
    const fake = makeFakeSandbox({ stdout: "" });
    __setSandboxFactoryForTests(fake);

    await executeSandboxCode({
      code: "return null;",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
      apiKey: "integrate_api_key_123",
      sessionToken: "sess_abc",
      providerTokens: { github: "ghp_xyz" },
      integrationsHeader: "github,gmail",
      context: { userId: "u_1" } as any,
    });

    const env = fake.getRecordedCommands()[0].env!;
    expect(env.INTEGRATE_MCP_URL).toBe("https://myapp.example.com/api/integrate/mcp");
    expect(env.INTEGRATE_API_KEY).toBe("integrate_api_key_123");
    expect(env.INTEGRATE_SESSION_TOKEN).toBe("sess_abc");
    expect(JSON.parse(env.INTEGRATE_PROVIDER_TOKENS)).toEqual({ github: "ghp_xyz" });
    expect(env.INTEGRATE_INTEGRATIONS).toBe("github,gmail");
    expect(JSON.parse(env.INTEGRATE_CONTEXT)).toEqual({ userId: "u_1" });
  });

  test("runtime integration proxies are non-thenable but still call tools", async () => {
    const previousMcpUrl = process.env.INTEGRATE_MCP_URL;
    process.env.INTEGRATE_MCP_URL = "https://myapp.example.com/api/integrate/mcp";
    const toolCalls: string[] = [];
    const mockFetch = mock(async (_url: string, options?: any) => {
      const body = JSON.parse(options?.body || "{}");
      toolCalls.push(body.name);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          content: [{ type: "text", text: "ok" }],
        }),
      } as Response;
    }) as any;
    global.fetch = mockFetch;

    try {
      const { client } = await importRuntimeStub();
      const github = client.github;

      expect(github.then).toBeUndefined();
      expect(await Promise.resolve(github)).toBe(github);
      expect(mockFetch).not.toHaveBeenCalled();

      await github.listRepos();

      expect(toolCalls).toEqual(["github_list_repos"]);
    } finally {
      if (previousMcpUrl === undefined) {
        delete process.env.INTEGRATE_MCP_URL;
      } else {
        process.env.INTEGRATE_MCP_URL = previousMcpUrl;
      }
    }
  });

  test("calls sandbox.stop() in finally even on success", async () => {
    const fake = makeFakeSandbox({ stdout: "" });
    __setSandboxFactoryForTests(fake);

    await executeSandboxCode({
      code: "return 1;",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
    });

    expect(fake.getStopCalls()).toBe(1);
  });

  test("calls sandbox.stop() in finally even when runCommand throws", async () => {
    let stopCalls = 0;
    const fake = {
      async create() {
        return {
          async writeFiles() {},
          async runCommand() {
            throw new Error("boom");
          },
          async stop() {
            stopCalls++;
          },
        };
      },
    };
    __setSandboxFactoryForTests(fake as any);

    const result = await executeSandboxCode({
      code: "return 1;",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("boom");
    expect(stopCalls).toBe(1);
  });

  test("returns error result when the sandbox fails to create", async () => {
    const fake = makeFakeSandbox({ createError: new Error("no capacity") });
    __setSandboxFactoryForTests(fake);

    const result = await executeSandboxCode({
      code: "return 1;",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
    });

    expect(result.success).toBe(false);
    expect(result.exitCode).toBe(-1);
    expect(result.error).toBe("no capacity");
  });

  test("derives a default networkPolicy allowing only the MCP host", async () => {
    let recordedNetworkPolicy: any;
    const fake = {
      async create(createOptions: any) {
        recordedNetworkPolicy = createOptions.networkPolicy;
        return {
          async writeFiles() {},
          async runCommand() {
            return { exitCode: 0, stdout: async () => "", stderr: async () => "" };
          },
          async stop() {},
        };
      },
    };
    __setSandboxFactoryForTests(fake as any);

    await executeSandboxCode({
      code: "return 1;",
      mcpUrl: "https://api.myapp.example.com/api/integrate/mcp",
    });

    expect(recordedNetworkPolicy).toEqual({ allow: ["api.myapp.example.com"] });
  });

  test("propagates non-zero exit codes as success=false", async () => {
    const fake = makeFakeSandbox({
      exitCode: 1,
      stderr: '__INTEGRATE_RESULT__{"error":{"message":"nope"}}\n',
    });
    __setSandboxFactoryForTests(fake);

    const result = await executeSandboxCode({
      code: "throw new Error('nope');",
      mcpUrl: "https://myapp.example.com/api/integrate/mcp",
    });

    expect(result.success).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.result).toEqual({ error: { message: "nope" } });
  });
});
