import { describe, expect, test } from "bun:test";
import { parseToolsFromListByIntegrationPayload } from "../../src/integrations/list-tools-by-integration.js";
import type { MCPTool } from "../../src/protocol/messages.js";

describe("parseToolsFromListByIntegrationPayload", () => {
  const availableTools = new Map<string, MCPTool>([
    [
      "calcom_list_bookings",
      {
        name: "calcom_list_bookings",
        description: "List all bookings",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  ]);

  test("resolves string tool names from availableTools", () => {
    const tools = parseToolsFromListByIntegrationPayload(
      {
        integration: "calcom",
        tools: ["calcom_list_bookings", "calcom_get_booking"],
      },
      availableTools
    );

    expect(tools).toHaveLength(2);
    expect(tools[0]?.description).toBe("List all bookings");
    expect(tools[1]?.name).toBe("calcom_get_booking");
  });

  test("keeps object tool metadata when schemas are present", () => {
    const tools = parseToolsFromListByIntegrationPayload(
      [
        {
          name: "github_create_issue",
          description: "Create an issue",
          inputSchema: { type: "object", properties: { title: { type: "string" } } },
        },
      ],
      availableTools
    );

    expect(tools).toHaveLength(1);
    expect(tools[0]?.description).toBe("Create an issue");
    expect(tools[0]?.inputSchema).toBeDefined();
  });
});
