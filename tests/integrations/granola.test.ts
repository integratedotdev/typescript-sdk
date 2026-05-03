import { describe, test, expect } from "bun:test";
import { granolaIntegration } from "../../src/integrations/granola.js";

describe("Granola Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = granolaIntegration({ apiKey: "test-api-key" });

    expect(integration.id).toBe("granola");
    expect(integration.name).toBe("Granola");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
  });

  test("throws without apiKey", () => {
    expect(() => granolaIntegration({ apiKey: "" })).toThrow();
  });

  test("getHeaders returns Bearer token header", () => {
    const integration = granolaIntegration({ apiKey: "my-granola-key" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my-granola-key",
    });
  });

  test("includes expected tools", () => {
    const integration = granolaIntegration({ apiKey: "test-key" });

    expect(integration.tools).toContain("granola_list_notes");
    expect(integration.tools).toContain("granola_get_note");
    expect(integration.tools).toContain("granola_list_folders");
  });

  test("does not have lifecycle hooks", () => {
    const integration = granolaIntegration({ apiKey: "test-key" });

    // Granola integration does not define onInit or onAfterConnect
    expect(integration.onInit).toBeUndefined();
    expect(integration.onAfterConnect).toBeUndefined();
  });
});
