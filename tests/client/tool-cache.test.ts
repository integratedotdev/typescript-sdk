import { describe, expect, mock, test } from "bun:test";
import { createMCPClient } from "../../src/client.js";
import { createSimpleIntegration } from "../../src/integrations/generic.js";
import type { MCPTool } from "../../src/protocol/messages.js";

const cachedTool: MCPTool = {
  name: "cached_tool",
  description: "Cached tool",
  inputSchema: { type: "object", properties: {} },
};

const uncachedTool: MCPTool = {
  name: "uncached_tool",
  description: "Uncached tool",
  inputSchema: { type: "object", properties: {} },
};

describe("MCPClientBase tool cache", () => {
  test("hydrates enabled tools without calling server fallback", async () => {
    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "test",
          tools: ["cached_tool"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    client.hydrateToolCache([cachedTool]);
    const callServerToolInternal = mock(async () => {
      throw new Error("fallback should not run");
    });
    (client as any).callServerToolInternal = callServerToolInternal;

    const tools = await client.getEnabledToolsAsync();

    expect(callServerToolInternal).not.toHaveBeenCalled();
    expect(tools).toEqual([cachedTool]);
    expect(client.getCachedEnabledTools()).toEqual([cachedTool]);
  });

  test("returns cached connected tools before fallback", async () => {
    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "test",
          tools: ["cached_tool"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    client.hydrateToolCache([cachedTool]);
    (client as any).initialized = true;
    (client as any).transport = { isConnected: () => true };
    const callServerToolInternal = mock(async () => [uncachedTool]);
    (client as any).callServerToolInternal = callServerToolInternal;

    const tools = await client.getEnabledToolsAsync();

    expect(callServerToolInternal).not.toHaveBeenCalled();
    expect(tools).toEqual([cachedTool]);
  });

  test("falls back to integration metadata when cache is empty", async () => {
    const client = createMCPClient({
      integrations: [
        createSimpleIntegration({
          id: "test",
          tools: ["uncached_tool"],
        }),
      ],
      connectionMode: "manual",
      singleton: false,
    });

    const callServerToolInternal = mock(async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify([uncachedTool]),
        },
      ],
    }));
    (client as any).callServerToolInternal = callServerToolInternal;

    const tools = await client.getEnabledToolsAsync();

    expect(callServerToolInternal).toHaveBeenCalledTimes(1);
    expect(tools).toEqual([uncachedTool]);
    expect(client.getCachedEnabledTools()).toEqual([uncachedTool]);
  });
});
