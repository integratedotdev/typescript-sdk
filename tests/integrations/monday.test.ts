import { describe, test, expect } from "bun:test";
import { mondayIntegration } from "../../src/integrations/monday.js";

describe("Monday.com Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = mondayIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("monday");
    expect(integration.name).toBe("Monday.com");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = mondayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("monday");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("has empty default scopes", () => {
    const integration = mondayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toEqual([]);
  });

  test("includes expected tools", () => {
    const integration = mondayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("monday_me");
    expect(integration.tools).toContain("monday_list_boards");
    expect(integration.tools).toContain("monday_create_item");
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = mondayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });
});
