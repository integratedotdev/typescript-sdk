import type { MCPToolCallResponse } from "../protocol/messages.js";

type JsonRecord = Record<string, unknown>;

export type ParsedMCPToolResult =
  | { ok: true; data: unknown; raw: MCPToolCallResponse | JsonRecord }
  | { ok: false; error: string; raw: MCPToolCallResponse | JsonRecord };

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getBooleanProperty(value: JsonRecord, key: string): boolean | undefined {
  const property = value[key];
  return typeof property === "boolean" ? property : undefined;
}

function getStringProperty(value: JsonRecord, key: string): string | undefined {
  const property = value[key];
  if (typeof property !== "string") {
    return undefined;
  }

  const trimmed = property.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getStructuredContent(result: JsonRecord): JsonRecord | undefined {
  const structuredContent = result.structuredContent;
  return isRecord(structuredContent) ? structuredContent : undefined;
}

function getContentText(result: JsonRecord): string | undefined {
  const content = result.content;
  if (!Array.isArray(content)) {
    return undefined;
  }

  for (const item of content) {
    if (!isRecord(item)) {
      continue;
    }

    const text = getStringProperty(item, "text");
    if (text) {
      return text;
    }
  }

  return undefined;
}

/**
 * Whether an MCP tool call response represents a failure.
 */
export function isMCPToolError(result: unknown): boolean {
  return parseMCPToolResult(result).ok === false;
}

/**
 * Parse an MCP `tools/call` response into a success/error result.
 *
 * Handles `isError`, `success: false`, structured content, and text content blocks.
 */
export function parseMCPToolResult(result: unknown): ParsedMCPToolResult {
  if (!isRecord(result)) {
    return {
      ok: true,
      data: result,
      raw: result as JsonRecord,
    };
  }

  const structuredContent = getStructuredContent(result);
  const failed =
    getBooleanProperty(result, "isError") === true ||
    getBooleanProperty(result, "success") === false ||
    getBooleanProperty(structuredContent ?? {}, "isError") === true ||
    getBooleanProperty(structuredContent ?? {}, "success") === false;

  if (!failed) {
    return {
      ok: true,
      data: structuredContent ?? result,
      raw: result as unknown as MCPToolCallResponse,
    };
  }

  return {
    ok: false,
    error:
      getStringProperty(result, "error") ??
      getStringProperty(structuredContent ?? {}, "error") ??
      getContentText(result) ??
      "Tool returned an error result",
    raw: result as unknown as MCPToolCallResponse,
  };
}
