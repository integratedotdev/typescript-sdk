import { describe, test, expect } from "bun:test";
import { salesforceIntegration } from "../../src/integrations/salesforce.js";

describe("Salesforce Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = salesforceIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("salesforce");
    expect(integration.name).toBe("Salesforce");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration with default scopes", () => {
    const integration = salesforceIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("salesforce");
    expect(integration.oauth?.scopes).toContain("api");
    expect(integration.oauth?.scopes).toContain("offline_access");
  });

  test("supports subdomain configuration", () => {
    const integration = salesforceIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      subdomain: "sandbox",
    });

    expect(integration.oauth?.config).toMatchObject({
      subdomain: "sandbox",
    });
  });

  test("includes expected tools", () => {
    const integration = salesforceIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("salesforce_query");
    expect(integration.tools).toContain("salesforce_get_limits");
    expect(integration.tools).toContain("salesforce_sobject_create");
    expect(integration.tools).toContain("salesforce_sobject_delete");
  });
});
