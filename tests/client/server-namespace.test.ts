/**
 * Server Namespace Tests
 * Tests for the new client.server.* typed API
 */

import { describe, test, expect, mock } from "bun:test";
import { createMCPClient } from "../../src/client.js";
import { githubIntegration } from "../../src/integrations/github.js";

describe("Server Namespace", () => {
  test("server namespace is always available", () => {
    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
          clientSecret: "test-secret",
        }),
      ],
    });

    expect(client.server).toBeDefined();
    expect(typeof client.server.listToolsByIntegration).toBe("function");
    expect(typeof client.server.listAllProviders).toBe("function");
  });

  test("server methods work through API handler without initialization", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        expect(options?.headers?.["X-Integrations"]).toBe("github");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "server tools result" }],
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
    const result = await client.server.listToolsByIntegration({ integration: "github" });
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe("server tools result");
  });

  test("callServerTool method works through API handler without initialization", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        expect(options?.headers?.["X-Integrations"]).toBe("github");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "server tools via callServerTool" }],
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
    const result = await client.callServerTool("list_tools_by_integration", {
      integration: "github",
    });
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe("server tools via callServerTool");
  });

  test("listAllProviders method works through API handler without initialization", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        expect(options?.headers?.["X-Integrations"]).toBe("github");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "all tools result" }],
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
    const result = await client.server.listAllProviders();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toBe("all tools result");
  });

  test("listConfiguredIntegrations returns local configuration", async () => {
    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
          scopes: ["repo"],
        }),
      ],
      connectionMode: 'manual',
      singleton: false,
    });

    const result = await client.server.listConfiguredIntegrations();
    expect(result.integrations).toHaveLength(1);
    expect(result.integrations[0].id).toBe("github");
    expect(result.integrations[0].hasOAuth).toBe(true);
    expect(result.integrations[0].tools.length).toBeGreaterThan(0);
    expect(result.integrations[0].scopes).toEqual(["repo"]);
  });

  test("listConfiguredIntegrations uses server config when available", async () => {
    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
          scopes: ["repo"],
        }),
      ],
      connectionMode: 'manual',
      singleton: false,
    });

    // Simulate server config (as set by createMCPServer)
    // This represents a different set of integrations configured on the server
    const serverIntegration = {
      id: "linear",
      tools: ["linear_list_issues", "linear_create_issue"],
      oauth: {
        provider: "linear",
        clientId: "server-linear-id",
        clientSecret: "server-linear-secret",
        scopes: ["read", "write"],
      },
    };
    
    (client as any).__oauthConfig = {
      providers: {},
      integrations: [serverIntegration],
    };

    const result = await client.server.listConfiguredIntegrations();
    
    // Should return server-configured integrations, not client integrations
    expect(result.integrations).toHaveLength(1);
    expect(result.integrations[0].id).toBe("linear");
    expect(result.integrations[0].hasOAuth).toBe(true);
    expect(result.integrations[0].tools).toEqual(["linear_list_issues", "linear_create_issue"]);
    expect(result.integrations[0].scopes).toEqual(["read", "write"]);
  });

  test("listConfiguredIntegrations with includeToolMetadata fetches metadata", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        const body = JSON.parse(options?.body || "{}");
        
        // Mock response for list_tools_by_integration
        if (body.name === "list_tools_by_integration") {
          const integration = body.arguments?.integration;
          return {
            ok: true,
            status: 200,
            json: async () => ({
              content: [{
                type: "text",
                text: JSON.stringify([
                  {
                    name: `${integration}_create_issue`,
                    description: `Create an issue in ${integration}`,
                    inputSchema: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        body: { type: "string" },
                      },
                      required: ["title"],
                    },
                  },
                  {
                    name: `${integration}_list_issues`,
                    description: `List issues in ${integration}`,
                    inputSchema: {
                      type: "object",
                      properties: {
                        state: { type: "string" },
                      },
                    },
                  },
                ]),
              }],
            }),
            headers: new Headers(),
          } as Response;
        }
      }
      return { ok: false } as Response;
    }) as any;

    global.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
          scopes: ["repo"],
        }),
      ],
      connectionMode: 'manual',
      singleton: false,
    });

    const result = await client.server.listConfiguredIntegrations({
      includeToolMetadata: true,
    });

    expect(result.integrations).toHaveLength(1);
    expect(result.integrations[0].id).toBe("github");
    expect(result.integrations[0].toolMetadata).toBeDefined();
    expect(result.integrations[0].toolMetadata?.length).toBe(2);
    expect(result.integrations[0].toolMetadata?.[0].name).toBe("github_create_issue");
    expect(result.integrations[0].toolMetadata?.[0].description).toBe("Create an issue in github");
    expect(result.integrations[0].toolMetadata?.[0].inputSchema).toBeDefined();
    expect(result.integrations[0].toolMetadata?.[1].name).toBe("github_list_issues");
  });

  test("listConfiguredIntegrations with includeToolMetadata handles errors gracefully", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        // Simulate server error
        return {
          ok: false,
          status: 500,
          text: async () => "Internal Server Error",
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
          scopes: ["repo"],
        }),
      ],
      connectionMode: 'manual',
      singleton: false,
    });

    const result = await client.server.listConfiguredIntegrations({
      includeToolMetadata: true,
    });

    // Should still return integration info even if metadata fetch fails
    expect(result.integrations).toHaveLength(1);
    expect(result.integrations[0].id).toBe("github");
    expect(result.integrations[0].toolMetadata).toEqual([]);
  });

  test("listConfiguredIntegrations without includeToolMetadata does not make server calls", async () => {
    const mockFetch = mock(async () => {
      throw new Error("Fetch should not be called");
    }) as any;

    global.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-id",
          scopes: ["repo"],
        }),
      ],
      connectionMode: 'manual',
      singleton: false,
    });

    // Should not make any server calls
    const result = await client.server.listConfiguredIntegrations();
    
    expect(result.integrations).toHaveLength(1);
    expect(result.integrations[0].id).toBe("github");
    expect(result.integrations[0].toolMetadata).toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

