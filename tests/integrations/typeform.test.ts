import { describe, test, expect } from "bun:test";
import { typeformIntegration } from "../../src/integrations/typeform.js";

describe("Typeform Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = typeformIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("typeform");
    expect(integration.name).toBe("Typeform");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Productivity");
  });

  test("uses default scopes and oauth endpoints", () => {
    const integration = typeformIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("offline");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://api.typeform.com/oauth/authorize",
      token_endpoint: "https://api.typeform.com/oauth/token",
    });
  });

  test("includes expected tools", () => {
    const integration = typeformIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("typeform_get_me");
    expect(integration.tools).toContain("typeform_list_forms");
    expect(integration.tools).toContain("typeform_create_form");
    expect(integration.tools).toContain("typeform_list_responses");
  });
});
