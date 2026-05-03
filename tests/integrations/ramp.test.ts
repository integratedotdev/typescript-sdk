import { describe, test, expect } from "bun:test";
import { rampIntegration } from "../../src/integrations/ramp.js";

describe("Ramp Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = rampIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("ramp");
    expect(integration.name).toBe("Ramp");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration with api base url", () => {
    const integration = rampIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      apiBaseUrl: "https://api.ramp.com/v2",
    });

    expect(integration.oauth?.provider).toBe("ramp");
    expect(integration.oauth?.config).toMatchObject({
      apiBaseUrl: "https://api.ramp.com/v2",
    });
  });

  test("includes expected tools", () => {
    const integration = rampIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("ramp_list_transactions");
    expect(integration.tools).toContain("ramp_list_cards");
    expect(integration.tools).toContain("ramp_list_users");
    expect(integration.tools).toContain("ramp_get_spend_limits");
  });

  test("has lifecycle hooks defined", () => {
    const integration = rampIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
