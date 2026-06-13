import { describe, expect, test } from "bun:test";
import {
  isMCPToolError,
  parseMCPToolResult,
} from "../../src/utils/parse-tool-result.js";

describe("parseMCPToolResult", () => {
  test("returns ok for successful structured content", () => {
    const result = parseMCPToolResult({
      structuredContent: { items: [1, 2] },
      content: [{ type: "text", text: "ok" }],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ items: [1, 2] });
    }
  });

  test("detects isError on root", () => {
    const result = parseMCPToolResult({
      isError: true,
      content: [{ type: "text", text: "boom" }],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("boom");
    }
    expect(isMCPToolError(result.raw)).toBe(true);
  });

  test("detects success false in structured content", () => {
    const result = parseMCPToolResult({
      structuredContent: { success: false, error: "rate limited" },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("rate limited");
    }
  });

  test("falls back to default error message", () => {
    const result = parseMCPToolResult({ isError: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Tool returned an error result");
    }
  });
});
