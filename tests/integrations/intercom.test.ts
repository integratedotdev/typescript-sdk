import { describe, test, expect } from "bun:test";
import { intercomIntegration } from "../../src/integrations/intercom.js";

describe("Intercom Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = intercomIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("intercom");
    expect(integration.name).toBe("Intercom");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = intercomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("intercom");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("includes expected tools", () => {
    const integration = intercomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("intercom_list_contacts");
    expect(integration.tools).toContain("intercom_list_conversations");
    expect(integration.tools).toContain("intercom_list_companies");
    expect(integration.tools).toContain("intercom_search_contacts");
  });

  test("has lifecycle hooks defined", () => {
    const integration = intercomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
