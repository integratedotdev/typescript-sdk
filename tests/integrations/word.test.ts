import { describe, test, expect } from "bun:test";
import { wordIntegration } from "../../src/integrations/word.js";

describe("Word Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = wordIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("word");
    expect(integration.name).toBe("Word");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = wordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("word");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("includes expected tools", () => {
    const integration = wordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("word_create");
    expect(integration.tools).toContain("word_get");
    expect(integration.tools).toContain("word_share");
    expect(integration.tools).toContain("word_update_content");
  });

  test("has lifecycle hooks defined", () => {
    const integration = wordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
