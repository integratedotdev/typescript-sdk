/**
 * Simplified Integration Tests
 * Tests that don't require a full HTTP streaming server
 */

import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { createMCPClient, clearClientCache } from "../../src/client.js";
import { createSimpleIntegration, genericOAuthIntegration } from "../../src/integrations/generic.js";
import { githubIntegration } from "../../src/integrations/github.js";
import { gmailIntegration } from "../../src/integrations/gmail.js";
import { granolaIntegration } from "../../src/integrations/granola.js";
import { dropboxIntegration } from "../../src/integrations/dropbox.js";
import { mercuryIntegration } from "../../src/integrations/mercury.js";

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = originalFetch;
});

afterEach(async () => {
  global.fetch = originalFetch;
  await clearClientCache();
});

describe("Integration - Client Configuration", () => {
  test("creates client with multiple integrations", () => {
    const client = createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [
        githubIntegration({
          clientId: "test-id",
          clientSecret: "test-secret",
        }),
        gmailIntegration({
          clientId: "gmail-id",
          clientSecret: "gmail-secret",
        }),
      ],
    });

    expect(client).toBeDefined();
    expect(client.isConnected()).toBe(false);

    const oauthConfigs = client.getAllOAuthConfigs();
    expect(oauthConfigs.size).toBe(2);
    expect(oauthConfigs.has("github")).toBe(true);
    expect(oauthConfigs.has("gmail")).toBe(true);
  });

  test("properly initializes integrations with lifecycle hooks", async () => {
    let initOrder: string[] = [];

    const integration1 = createSimpleIntegration({
      id: "integration1",
      tools: ["integration1/tool"],
      onInit: () => {
        initOrder.push("integration1-init");
      },
    });

    const integration2 = createSimpleIntegration({
      id: "integration2",
      tools: ["integration2/tool"],
      onInit: () => {
        initOrder.push("integration2-init");
      },
    });

    createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [integration1, integration2],
    });

    // Wait for async initialization
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(initOrder).toEqual(["integration1-init", "integration2-init"]);
  });

  test("correctly filters tools by enabled integrations", () => {
    const client = createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [
        createSimpleIntegration({
          id: "test",
          tools: ["test/tool1", "test/tool2", "test/tool3"],
        }),
      ],
    });

    // Before connection, enabled tools is empty
    expect(client.getEnabledTools()).toEqual([]);
  });

  test("supports custom OAuth providers", () => {
    const slackIntegration = genericOAuthIntegration({
      id: "slack",
      provider: "slack",
      clientId: "slack-id",
      clientSecret: "slack-secret",
      scopes: ["chat:write"],
      tools: ["slack/sendMessage"],
    });

    const client = createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [slackIntegration],
    });

    const config = client.getOAuthConfig("slack");
    expect(config).toBeDefined();
    expect(config?.provider).toBe("slack");
    expect(config?.scopes).toContain("chat:write");
  });
});

describe("Integration - Error Handling", () => {
  test("can call tools through API handler without initialization", async () => {
    const mockFetch = mock(async (url: string) => {
      if (url.includes("/api/integrate/mcp")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "api handler result" }],
          }),
          headers: new Headers(),
        } as Response;
      }
      return { ok: false } as Response;
    }) as any;

    global.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
        }),
      ],
      connectionMode: 'manual',  // Manual mode - no auto-connect
      singleton: false,
    });

    // Should work through API handler without calling connect()
    const result = await client.github.getRepo({ owner: "test", repo: "test" });
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe("api handler result");
  });

  test.skip("handles connection to invalid URL", async () => {
    // This test is no longer applicable since the server URL is now
    // determined by NODE_ENV and cannot be configured per-client.
    // Connection error handling is tested through other integration tests.
  }, 5000);

  test("works with generic MCP tool calls for Granola tools", async () => {
    const calls: Array<{ name: string; headers: HeadersInit | undefined; body: string }> = [];

    global.fetch = mock(async (_url: string, init?: RequestInit) => {
      calls.push({
        name: JSON.parse(String(init?.body)).name,
        headers: init?.headers,
        body: String(init?.body),
      });

      return {
        ok: true,
        status: 200,
        json: async () => ({
          content: [{ type: "text", text: "ok" }],
        }),
        headers: new Headers(),
      } as Response;
    }) as any;

    const client = createMCPClient({
      integrations: [
        granolaIntegration({
          apiKey: "gr_test_key",
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    await client.callTool("granola_list_notes", {
      created_after: "2026-01-01",
      page_size: 10,
    });
    await client.callTool("granola_get_note", {
      note_id: "not_123",
      include_transcript: true,
    });
    await client.callTool("granola_list_folders", {
      page_size: 10,
    });

    expect(calls).toHaveLength(3);
    expect(calls.map((call) => call.name)).toEqual([
      "granola_list_notes",
      "granola_get_note",
      "granola_list_folders",
    ]);

    for (const call of calls) {
      expect(call.headers).toMatchObject({
        Authorization: "Bearer gr_test_key",
      });
    }
  });

  test("works with generic MCP tool calls for Dropbox tools", async () => {
    const calls: Array<{ name: string; headers: HeadersInit | undefined; body: string }> = [];

    global.fetch = mock(async (_url: string, init?: RequestInit) => {
      calls.push({
        name: JSON.parse(String(init?.body)).name,
        headers: init?.headers,
        body: String(init?.body),
      });

      return {
        ok: true,
        status: 200,
        json: async () => ({
          content: [{ type: "text", text: "ok" }],
        }),
        headers: new Headers(),
      } as Response;
    }) as any;

    const client = createMCPClient({
      integrations: [
        dropboxIntegration({
          clientId: "dropbox-id",
          clientSecret: "dropbox-secret",
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    await client.callTool("dropbox_get_current_account");
    await client.callTool("dropbox_list_folder", {
      path: "/",
      limit: 50,
    });
    await client.callTool("dropbox_upload_text_file", {
      path: "/notes/today.txt",
      content: "hello world",
      mode: "overwrite",
    });
    await client.callTool("dropbox_create_shared_link", {
      path: "/docs/report.pdf",
    });

    expect(calls).toHaveLength(4);
    expect(calls.map((call) => call.name)).toEqual([
      "dropbox_get_current_account",
      "dropbox_list_folder",
      "dropbox_upload_text_file",
      "dropbox_create_shared_link",
    ]);

    for (const call of calls) {
      expect(call.headers).not.toMatchObject({
        Authorization: expect.any(String),
      });
    }
  });

  test("works with generic MCP tool calls for Mercury tools", async () => {
    const calls: Array<{ name: string; headers: HeadersInit | undefined; body: string }> = [];

    global.fetch = mock(async (_url: string, init?: RequestInit) => {
      calls.push({
        name: JSON.parse(String(init?.body)).name,
        headers: init?.headers,
        body: String(init?.body),
      });

      return {
        ok: true,
        status: 200,
        json: async () => ({
          content: [{ type: "text", text: "ok" }],
        }),
        headers: new Headers(),
      } as Response;
    }) as any;

    const client = createMCPClient({
      integrations: [
        mercuryIntegration({
          apiKey: "secret-token:mercury_test",
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    await client.callTool("mercury_get_organization");
    await client.callTool("mercury_list_accounts", {
      limit: 50,
    });
    await client.callTool("mercury_list_transactions", {
      start: "2026-01-01",
      end: "2026-01-31",
      limit: 100,
    });
    await client.callTool("mercury_list_cards", {
      account_ids: "account-1,account-2",
    });
    await client.callTool("mercury_list_recipients");
    await client.callTool("mercury_create_internal_transfer", {
      source_account_id: "src-uuid",
      destination_account_id: "dest-uuid",
      amount: 25,
      idempotency_key: "transfer-123",
    });

    expect(calls).toHaveLength(6);
    expect(calls.map((call) => call.name)).toEqual([
      "mercury_get_organization",
      "mercury_list_accounts",
      "mercury_list_transactions",
      "mercury_list_cards",
      "mercury_list_recipients",
      "mercury_create_internal_transfer",
    ]);

    for (const call of calls) {
      expect(call.headers).toMatchObject({
        Authorization: "Bearer secret-token:mercury_test",
      });
    }
  });
});

describe("Integration - Integration Combinations", () => {
  test("works with mix of OAuth and simple integrations", () => {
    const client = createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [
        githubIntegration({
          clientId: "github-id",
          clientSecret: "github-secret",
        }),
        createSimpleIntegration({
          id: "local",
          tools: ["local/tool1", "local/tool2"],
        }),
      ],
    });

    const configs = client.getAllOAuthConfigs();
    expect(configs.size).toBe(1); // Only GitHub has OAuth
    expect(configs.has("github")).toBe(true);
    expect(configs.has("local")).toBe(false);
  });

  test("handles duplicate tool names across integrations", () => {
    // This tests that the client can handle integrations with overlapping tool names
    const client = createMCPClient({
      serverUrl: "https://mcp.integrate.dev:8080/api/v1/mcp",
      integrations: [
        createSimpleIntegration({
          id: "integration1",
          tools: ["shared/tool", "integration1/tool"],
        }),
        createSimpleIntegration({
          id: "integration2",
          tools: ["shared/tool", "integration2/tool"],
        }),
      ],
    });

    expect(client).toBeDefined();
  });
});
