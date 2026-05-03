import { describe, test, expect } from "bun:test";
import { polarIntegration } from "../../src/integrations/polar.js";

describe("Polar Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = polarIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("polar");
    expect(integration.name).toBe("Polar");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = polarIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      apiBaseUrl: "https://api.example.polar.sh",
    });

    expect(integration.oauth?.provider).toBe("polar");
    expect(integration.oauth?.config).toMatchObject({
      apiBaseUrl: "https://api.example.polar.sh",
    });
  });

  test("includes expected tools", () => {
    const integration = polarIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("polar_list_products");
    expect(integration.tools).toContain("polar_list_subscriptions");
    expect(integration.tools).toContain("polar_list_orders");
    expect(integration.tools).toContain("polar_get_metrics");
  });

  test("has lifecycle hooks defined", () => {
    const integration = polarIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
