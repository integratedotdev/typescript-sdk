import { describe, test, expect } from "bun:test";
import { hubspotIntegration } from "../../src/integrations/hubspot.js";

describe("HubSpot Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = hubspotIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("hubspot");
    expect(integration.name).toBe("HubSpot");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = hubspotIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("hubspot");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = hubspotIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("includes expected tools", () => {
    const integration = hubspotIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("hubspot_list_contacts");
    expect(integration.tools).toContain("hubspot_list_companies");
    expect(integration.tools).toContain("hubspot_list_deals");
    expect(integration.tools).toContain("hubspot_list_tickets");
  });

  test("has lifecycle hooks defined", () => {
    const integration = hubspotIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
