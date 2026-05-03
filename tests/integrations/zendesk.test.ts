import { describe, test, expect } from "bun:test";
import { zendeskIntegration } from "../../src/integrations/zendesk.js";

describe("Zendesk Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = zendeskIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("zendesk");
    expect(integration.name).toBe("Zendesk");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = zendeskIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      subdomain: "acme",
    });

    expect(integration.oauth?.provider).toBe("zendesk");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect(integration.oauth?.config).toMatchObject({
      subdomain: "acme",
    });
  });

  test("includes expected tools", () => {
    const integration = zendeskIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("zendesk_list_tickets");
    expect(integration.tools).toContain("zendesk_list_users");
    expect(integration.tools).toContain("zendesk_list_organizations");
    expect(integration.tools).toContain("zendesk_list_views");
  });

  test("has lifecycle hooks defined", () => {
    const integration = zendeskIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
