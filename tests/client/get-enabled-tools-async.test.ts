/**
 * Tests for getEnabledToolsAsync() method
 * Ensures tools with schemas are always returned regardless of connection state
 */

import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { createMCPClient } from "../../src/client.js";
import { githubIntegration } from "../../src/integrations/github.js";
import { createSimpleIntegration } from "../../src/integrations/generic.js";
import type { MCPTool } from "../../src/protocol/messages.js";

describe("getEnabledToolsAsync", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("returns cached tools when client is connected and tools are discovered", async () => {
    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    const mockTool: MCPTool = {
      name: "github_create_issue",
      description: "Create a GitHub issue",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Issue title" },
          body: { type: "string", description: "Issue body" },
        },
        required: ["title"],
      },
    };

    // Simulate connected state with cached tools
    (client as any).availableTools = new Map([[mockTool.name, mockTool]]);
    (client as any).initialized = true;
    (client as any).transport = { isConnected: () => true };

    const tools = await client.getEnabledToolsAsync();

    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("github_create_issue");
    expect(tools[0].description).toBe("Create a GitHub issue");
    expect(tools[0].inputSchema).toBeDefined();
    expect(tools[0].inputSchema.type).toBe("object");
    expect(tools[0].inputSchema.properties?.title).toBeDefined();
  });

  test("fetches tools from server when not connected", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        const body = JSON.parse(options?.body || "{}");
        
        if (body.name === "list_tools_by_integration") {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              content: [{
                type: "text",
                text: JSON.stringify([
                  {
                    name: "github_create_issue",
                    description: "Create a GitHub issue",
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
                    name: "github_list_repos",
                    description: "List repositories",
                    inputSchema: {
                      type: "object",
                      properties: {
                        owner: { type: "string" },
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

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue", "github_list_repos"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    // Don't simulate connection - client is not connected
    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    expect(mockFetch).toHaveBeenCalled();
    expect(tools).toHaveLength(2);
    expect(tools[0].name).toBe("github_create_issue");
    expect(tools[0].inputSchema).toBeDefined();
    expect(tools[0].inputSchema.type).toBe("object");
    expect(tools[1].name).toBe("github_list_repos");
  });

  test("caches fetched tools for subsequent calls", async () => {
    let fetchCount = 0;
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{
              type: "text",
              text: JSON.stringify([
                {
                  name: "github_create_issue",
                  description: "Create issue",
                  inputSchema: { type: "object", properties: {} },
                },
              ]),
            }],
          }),
          headers: new Headers(),
        } as Response;
      }
      return { ok: false } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    // First call - should fetch from server
    const tools1 = await client.getEnabledToolsAsync();
    expect(tools1).toHaveLength(1);
    expect(fetchCount).toBe(1);

    // Second call - should use cache
    const tools2 = await client.getEnabledToolsAsync();
    expect(tools2).toHaveLength(1);
    expect(fetchCount).toBe(1); // No additional fetch
  });

  test("only returns enabled tools from fetched results", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{
              type: "text",
              text: JSON.stringify([
                {
                  name: "github_create_issue",
                  description: "Create issue",
                  inputSchema: { type: "object", properties: {} },
                },
                {
                  name: "github_delete_repo",
                  description: "Delete repo (not enabled)",
                  inputSchema: { type: "object", properties: {} },
                },
              ]),
            }],
          }),
          headers: new Headers(),
        } as Response;
      }
      return { ok: false } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"], // Only this tool is enabled
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    // Should only return the enabled tool
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("github_create_issue");
  });

  test("handles server errors gracefully and returns empty array", async () => {
    const mockFetch = mock(async () => {
      return {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ error: "Server error" }),
        headers: new Headers(),
      } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    // Should not throw, just return empty array
    const tools = await client.getEnabledToolsAsync();
    expect(tools).toHaveLength(0);
  });

  test("fetches tools from multiple integrations in parallel", async () => {
    const callOrder: string[] = [];
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        const body = JSON.parse(options?.body || "{}");
        const integration = body.arguments?.integration;
        callOrder.push(integration);

        const toolsMap: Record<string, any[]> = {
          github: [
            { name: "github_create_issue", description: "Create issue", inputSchema: { type: "object", properties: {} } },
          ],
          slack: [
            { name: "slack_send_message", description: "Send message", inputSchema: { type: "object", properties: {} } },
          ],
        };

        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{
              type: "text",
              text: JSON.stringify(toolsMap[integration] || []),
            }],
          }),
          headers: new Headers(),
        } as Response;
      }
      return { ok: false } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
        createSimpleIntegration({
          id: "slack",
          tools: ["slack_send_message"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    expect(tools).toHaveLength(2);
    expect(tools.map(t => t.name).sort()).toEqual(["github_create_issue", "slack_send_message"]);
    
    // Both integrations should have been fetched
    expect(callOrder).toContain("github");
    expect(callOrder).toContain("slack");
  });

  test("handles response with tools property wrapper", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{
              type: "text",
              text: JSON.stringify({
                tools: [
                  {
                    name: "github_create_issue",
                    description: "Create issue",
                    inputSchema: { type: "object", properties: {} },
                  },
                ],
              }),
            }],
          }),
          headers: new Headers(),
        } as Response;
      }
      return { ok: false } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("github_create_issue");
  });

  test("inputSchema is always populated in returned tools", async () => {
    const mockFetch = mock(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          content: [{
            type: "text",
            text: JSON.stringify([
              {
                name: "github_create_issue",
                description: "Create issue",
                inputSchema: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Issue title" },
                    body: { type: "string", description: "Issue body" },
                    labels: { type: "array", items: { type: "string" } },
                  },
                  required: ["title"],
                },
              },
            ]),
          }],
        }),
        headers: new Headers(),
      } as Response;
    }) as any;

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "github",
          tools: ["github_create_issue"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    expect(tools).toHaveLength(1);
    const tool = tools[0];
    
    // Verify inputSchema structure
    expect(tool.inputSchema).toBeDefined();
    expect(tool.inputSchema.type).toBe("object");
    expect(tool.inputSchema.properties).toBeDefined();
    expect(tool.inputSchema.properties?.title).toEqual({ type: "string", description: "Issue title" });
    expect(tool.inputSchema.properties?.body).toEqual({ type: "string", description: "Issue body" });
    expect(tool.inputSchema.required).toEqual(["title"]);
  });

  test("works with real githubIntegration", async () => {
    const mockFetch = mock(async (url: string, options?: any) => {
      if (url.includes("/api/integrate/mcp")) {
        const body = JSON.parse(options?.body || "{}");
        
        if (body.name === "list_tools_by_integration" && body.arguments?.integration === "github") {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              content: [{
                type: "text",
                text: JSON.stringify([
                  {
                    name: "github_create_issue",
                    description: "Create a new issue in a GitHub repository",
                    inputSchema: {
                      type: "object",
                      properties: {
                        owner: { type: "string", description: "Repository owner" },
                        repo: { type: "string", description: "Repository name" },
                        title: { type: "string", description: "Issue title" },
                        body: { type: "string", description: "Issue body (markdown)" },
                      },
                      required: ["owner", "repo", "title"],
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

    globalThis.fetch = mockFetch;

    const client = createMCPClient({
      integrations: [
        githubIntegration({
          clientId: "test-client-id",
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    (client as any).transport = { isConnected: () => false };

    const tools = await client.getEnabledToolsAsync();

    // Should return at least one github tool with proper schema
    const createIssueTool = tools.find(t => t.name === "github_create_issue");
    expect(createIssueTool).toBeDefined();
    expect(createIssueTool?.inputSchema).toBeDefined();
    expect(createIssueTool?.inputSchema.properties?.owner).toBeDefined();
    expect(createIssueTool?.inputSchema.properties?.repo).toBeDefined();
    expect(createIssueTool?.inputSchema.properties?.title).toBeDefined();
  });
});
