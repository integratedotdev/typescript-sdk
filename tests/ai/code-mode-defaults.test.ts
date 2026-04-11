import { afterEach, describe, expect, test } from "bun:test";
import { createMCPClient } from "../../src/client.js";
import { createSimpleIntegration } from "../../src/integrations/generic.js";
import { getVercelAITools } from "../../src/ai/vercel-ai.js";
import { getOpenAITools } from "../../src/ai/openai.js";
import { getAnthropicTools } from "../../src/ai/anthropic.js";
import { getGoogleTools } from "../../src/ai/google.js";
import {
  CODE_MODE_TOOL_NAME,
  __resetCodeModeFallbackWarnings,
} from "../../src/code-mode/tool-builder.js";
import { __setSandboxFactoryForTests, __setSandboxUnavailableForTests } from "../../src/code-mode/executor.js";
import type { MCPTool } from "../../src/protocol/messages.js";

const MOCK_TOOL: MCPTool = {
  name: "test_tool",
  description: "Test tool",
  inputSchema: {
    type: "object",
    properties: {
      input: {
        type: "string",
      },
    },
    required: ["input"],
  },
};

function createTestClient(publicUrl?: string, apiKey?: string) {
  const client = createMCPClient({
    integrations: [
      createSimpleIntegration({
        id: "test",
        tools: [MOCK_TOOL.name],
      }),
    ],
  });

  (client as any).availableTools = new Map([[MOCK_TOOL.name, MOCK_TOOL]]);
  (client as any).initialized = true;
  (client as any).transport = { isConnected: () => true };
  (client as any).__oauthConfig = {
    apiKey,
    integrations: [{ id: "test" }],
    codeMode: publicUrl ? { publicUrl } : undefined,
  };

  return client;
}

function makeSandboxFactory(onRunCommand?: (params: any) => void) {
  return {
    async create() {
      return {
        async writeFiles() {},
        async runCommand(params?: any) {
          onRunCommand?.(params);
          return {
            exitCode: 0,
            stdout: async () => "",
            stderr: async () => "",
          };
        },
        async stop() {},
      };
    },
  } as any;
}

afterEach(() => {
  __setSandboxFactoryForTests(null);
  __setSandboxUnavailableForTests(false);
  __resetCodeModeFallbackWarnings();
  delete process.env.INTEGRATE_URL;
});

function captureWarnings(): { warnings: string[]; restore: () => void } {
  const warnings: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
  };
  return {
    warnings,
    restore: () => {
      console.warn = original;
    },
  };
}

describe("AI helper code mode defaults", () => {
  test("falls back to tools mode for all helpers when sandbox is unavailable", async () => {
    const client = createTestClient();

    const [vercelTools, openaiTools, anthropicTools, googleTools] = await Promise.all([
      getVercelAITools(client),
      getOpenAITools(client),
      getAnthropicTools(client),
      getGoogleTools(client),
    ]);

    expect(Object.keys(vercelTools)).toEqual(["test_tool"]);
    expect(openaiTools.map((tool) => tool.name)).toEqual(["test_tool"]);
    expect(anthropicTools.map((tool) => tool.name)).toEqual(["test_tool"]);
    expect(googleTools.map((tool) => tool.name)).toEqual(["test_tool"]);
  });

  test("falls back to tools mode for all helpers when publicUrl is unavailable", async () => {
    __setSandboxFactoryForTests(makeSandboxFactory());
    const client = createTestClient();

    const [vercelTools, openaiTools, anthropicTools, googleTools] = await Promise.all([
      getVercelAITools(client),
      getOpenAITools(client),
      getAnthropicTools(client),
      getGoogleTools(client),
    ]);

    expect(vercelTools[CODE_MODE_TOOL_NAME]).toBeUndefined();
    expect(openaiTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(false);
    expect(anthropicTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(false);
    expect(googleTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(false);
  });

  test("defaults to code mode for all helpers when sandbox and publicUrl are available", async () => {
    __setSandboxFactoryForTests(makeSandboxFactory());
    const client = createTestClient("https://example.com");

    const [vercelTools, openaiTools, anthropicTools, googleTools] = await Promise.all([
      getVercelAITools(client),
      getOpenAITools(client),
      getAnthropicTools(client),
      getGoogleTools(client),
    ]);

    expect(Object.keys(vercelTools)).toContain(CODE_MODE_TOOL_NAME);
    expect(openaiTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(true);
    expect(anthropicTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(true);
    expect(googleTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(true);
  });

  test("uses INTEGRATE_URL env var when auto-detecting code mode", async () => {
    __setSandboxFactoryForTests(makeSandboxFactory());
    process.env.INTEGRATE_URL = "https://example.com";
    const client = createTestClient();

    const openaiTools = await getOpenAITools(client);

    expect(openaiTools.some((tool) => tool.name === CODE_MODE_TOOL_NAME)).toBe(true);
  });

  test("preserves explicit code mode when sandbox is unavailable", async () => {
    __setSandboxUnavailableForTests(true);
    __setSandboxFactoryForTests({
      async create() {
        throw new Error(
          "Code Mode requires the optional peer dependency `@vercel/sandbox`. " +
          "Install it with `npm install @vercel/sandbox` (or `bun add @vercel/sandbox`)."
        );
      },
    } as any);
    const client = createTestClient("https://example.com");

    const vercelTools = await getVercelAITools(client, { mode: "code" });
    const result = await vercelTools[CODE_MODE_TOOL_NAME].execute({ code: "return 1;" });

    expect(vercelTools[CODE_MODE_TOOL_NAME]).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error).toContain("Code Mode requires the optional peer dependency `@vercel/sandbox`.");
  });

  test("warns once with reason=sandbox-missing when sandbox is unavailable", async () => {
    __setSandboxUnavailableForTests(true);
    const client = createTestClient("https://example.com");
    const { warnings, restore } = captureWarnings();

    try {
      await getVercelAITools(client);
      await getOpenAITools(client);
    } finally {
      restore();
    }

    const matching = warnings.filter((w) => w.includes("sandbox-missing"));
    expect(matching.length).toBe(1);
    expect(matching[0]).toContain("[integrate-sdk] Code Mode unavailable");
    expect(matching[0]).toContain("falling back to tool mode");
  });

  test("warns once with reason=no-public-url when publicUrl is missing", async () => {
    __setSandboxFactoryForTests(makeSandboxFactory());
    const client = createTestClient();
    const { warnings, restore } = captureWarnings();

    try {
      await getVercelAITools(client);
      await getAnthropicTools(client);
      await getGoogleTools(client);
    } finally {
      restore();
    }

    const matching = warnings.filter((w) => w.includes("no-public-url"));
    expect(matching.length).toBe(1);
    expect(matching[0]).toContain("INTEGRATE_URL");
  });

  test("does not warn when Code Mode is available", async () => {
    __setSandboxFactoryForTests(makeSandboxFactory());
    const client = createTestClient("https://example.com");
    const { warnings, restore } = captureWarnings();

    try {
      await getVercelAITools(client);
    } finally {
      restore();
    }

    expect(warnings.filter((w) => w.includes("Code Mode unavailable"))).toEqual([]);
  });

  test("does not warn when mode is explicitly set", async () => {
    __setSandboxUnavailableForTests(true);
    const client = createTestClient();
    const { warnings, restore } = captureWarnings();

    try {
      await getVercelAITools(client, { mode: "tools" });
    } finally {
      restore();
    }

    expect(warnings.filter((w) => w.includes("Code Mode unavailable"))).toEqual([]);
  });

  test("passes server API key into code mode sandbox execution", async () => {
    let recordedEnv: Record<string, string> | undefined;
    __setSandboxFactoryForTests(
      makeSandboxFactory((params) => {
        recordedEnv = params?.env;
      })
    );
    const client = createTestClient("https://example.com", "server_api_key_123");

    const vercelTools = await getVercelAITools(client, { mode: "code" });
    const result = await vercelTools[CODE_MODE_TOOL_NAME].execute({ code: "return 1;" });

    expect(result.success).toBe(true);
    expect(recordedEnv?.INTEGRATE_API_KEY).toBe("server_api_key_123");
  });
});
