import { describe, test, expect } from "bun:test";
import { figmaIntegration } from "../../src/integrations/figma.js";

describe("Figma Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = figmaIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("figma");
    expect(integration.name).toBe("Figma");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = figmaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("figma");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("accepts custom scopes", () => {
    const integration = figmaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["files:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["files:read"]);
  });

  test("includes expected tools", () => {
    const integration = figmaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("figma_get_file");
    expect(integration.tools).toContain("figma_get_comments");
    expect(integration.tools).toContain("figma_get_component");
    expect(integration.tools).toContain("figma_get_local_variables");
  });

  test("has lifecycle hooks defined", () => {
    const integration = figmaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
