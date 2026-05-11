import { describe, test, expect } from "bun:test";
import { mailchimpIntegration } from "../../src/integrations/mailchimp.js";

describe("Mailchimp Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = mailchimpIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("mailchimp");
    expect(integration.name).toBe("Mailchimp");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("uses empty default scopes", () => {
    const integration = mailchimpIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("mailchimp");
    expect(integration.oauth?.scopes).toEqual([]);
  });

  test("includes expected tools", () => {
    const integration = mailchimpIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("mailchimp_ping");
    expect(integration.tools).toContain("mailchimp_list_audiences");
    expect(integration.tools).toContain("mailchimp_add_or_update_member");
    expect(integration.tools).toContain("mailchimp_list_campaigns");
  });

  test("does not define lifecycle hooks", () => {
    const integration = mailchimpIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeUndefined();
    expect(integration.onAfterConnect).toBeUndefined();
  });
});
