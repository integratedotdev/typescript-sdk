import { describe, test, expect } from "bun:test";
import { stripeIntegration } from "../../src/integrations/stripe.js";

describe("Stripe Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = stripeIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("stripe");
    expect(integration.name).toBe("Stripe");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = stripeIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("stripe");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("includes expected tools", () => {
    const integration = stripeIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("stripe_list_customers");
    expect(integration.tools).toContain("stripe_list_payments");
    expect(integration.tools).toContain("stripe_list_subscriptions");
    expect(integration.tools).toContain("stripe_get_balance");
  });

  test("has lifecycle hooks defined", () => {
    const integration = stripeIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
