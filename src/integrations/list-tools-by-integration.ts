import type { MCPTool } from "../protocol/messages.js";

function extractToolEntries(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && "tools" in payload) {
    const tools = (payload as { tools?: unknown }).tools;
    if (Array.isArray(tools)) {
      return tools;
    }
  }

  return [];
}

function toMetadataTool(
  entry: { name: string; description?: string; inputSchema?: MCPTool["inputSchema"] },
  availableTools: ReadonlyMap<string, MCPTool>
): MCPTool | null {
  if (entry.inputSchema) {
    return {
      name: entry.name,
      description: entry.description,
      inputSchema: entry.inputSchema,
    };
  }

  const cached = availableTools.get(entry.name);
  if (cached) {
    return cached;
  }

  return {
    name: entry.name,
    description: entry.description,
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}

/**
 * Normalize `list_tools_by_integration` payloads.
 *
 * The MCP server returns `{ tools: string[] }` while older mocks used
 * `ToolMetadata[]`. When names are strings, resolve full metadata from
 * `availableTools` (populated by tools/list during connect).
 */
export function parseToolsFromListByIntegrationPayload(
  payload: unknown,
  availableTools: ReadonlyMap<string, MCPTool>
): MCPTool[] {
  const tools: MCPTool[] = [];

  for (const entry of extractToolEntries(payload)) {
    if (typeof entry === "string") {
      const cached = availableTools.get(entry);
      tools.push(
        cached ?? {
          name: entry,
          inputSchema: { type: "object", properties: {} },
        }
      );
      continue;
    }

    if (!entry || typeof entry !== "object" || !("name" in entry)) {
      continue;
    }

    const candidate = entry as {
      name?: string;
      description?: string;
      inputSchema?: MCPTool["inputSchema"];
    };

    if (!candidate.name) {
      continue;
    }

    const normalized = toMetadataTool(
      {
        name: candidate.name,
        description: candidate.description,
        inputSchema: candidate.inputSchema,
      },
      availableTools
    );

    if (normalized) {
      tools.push(normalized);
    }
  }

  return tools;
}

export function parseToolsFromListByIntegrationText(
  text: string,
  availableTools: ReadonlyMap<string, MCPTool>
): MCPTool[] {
  try {
    return parseToolsFromListByIntegrationPayload(
      JSON.parse(text),
      availableTools
    );
  } catch {
    return [];
  }
}
