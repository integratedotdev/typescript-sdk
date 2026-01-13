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

  test("listConfiguredIntegrations returns local configuration with server metadata", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        // Check if this is the list_all_providers call
        // The client sends { name, arguments } to the API handler
        const body = options?.body ? JSON.parse(options.body) : {};
        if (body.name === "list_all_providers") {
          // API handler returns MCPToolCallResponse directly (already unwrapped from JSON-RPC)
          return {
            ok: true,
            status: 200,
            json: async () => ({
              content: [{
                type: "text",
                text: JSON.stringify({
                  integrations: [
                    {
                      name: "GitHub",
                      logo_url: "https://example.com/github-logo.png",
                      description: "Manage GitHub repositories, issues, and pull requests",
                      owner: "integrate",
                      example_usage: "Create issues, manage pull requests"
                    }
                  ]
                })
              }]
            }),
            headers: new Headers(),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "other result" }],
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
    
    // Check server metadata is included
    expect(result.integrations[0].name).toBe("GitHub");
    expect(result.integrations[0].logoUrl).toBe("https://example.com/github-logo.png");
    expect(result.integrations[0].description).toBe("Manage GitHub repositories, issues, and pull requests");
    expect(result.integrations[0].owner).toBe("integrate");
    expect(result.integrations[0].exampleUsage).toBe("Create issues, manage pull requests");
  });

  test("listConfiguredIntegrations falls back to local-only when server call fails", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        // Make list_all_providers call fail
        const body = options?.body ? JSON.parse(options.body) : {};
        if (body.name === "list_all_providers") {
          return {
            ok: false,
            status: 500,
            json: async () => ({ error: "Server error" }),
            headers: new Headers(),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ type: "text", text: "other result" }],
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
    
    // Server metadata should not be present (graceful fallback)
    expect(result.integrations[0].logoUrl).toBeUndefined();
    expect(result.integrations[0].description).toBeUndefined();
  });
});

