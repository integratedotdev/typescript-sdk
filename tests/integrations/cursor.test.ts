import { describe, test, expect } from "bun:test";
import { cursorIntegration } from "../../src/integrations/cursor.js";

describe("Cursor Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = cursorIntegration();

    expect(integration.id).toBe("cursor");
    expect(integration.name).toBe("Cursor");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes expected tools", () => {
    const integration = cursorIntegration();

    expect(integration.tools).toContain("cursor_list_agents");
    expect(integration.tools).toContain("cursor_get_agent");
    expect(integration.tools).toContain("cursor_launch_agent");
    expect(integration.tools).toContain("cursor_get_me");
  });

  test("has lifecycle hooks defined", () => {
    const integration = cursorIntegration();

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = cursorIntegration();

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("accepts optional config without throwing", () => {
    expect(() => cursorIntegration({})).not.toThrow();
    expect(() => cursorIntegration({ apiKey: "some-key" })).not.toThrow();
  });
});
