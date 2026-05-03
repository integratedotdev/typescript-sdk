import { describe, test, expect } from "bun:test";
import { linkedinIntegration } from "../../src/integrations/linkedin.js";

describe("LinkedIn Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = linkedinIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("linkedin");
    expect(integration.name).toBe("LinkedIn");
    expect(integration.tools).toEqual(["linkedin_get_userinfo", "linkedin_create_post"]);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration with default scopes", () => {
    const integration = linkedinIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("linkedin");
    expect(integration.oauth?.scopes).toContain("openid");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://www.linkedin.com/oauth/v2/authorization",
      token_endpoint: "https://www.linkedin.com/oauth/v2/accessToken",
    });
  });

  test("accepts custom scopes", () => {
    const integration = linkedinIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["profile"],
    });

    expect(integration.oauth?.scopes).toEqual(["profile"]);
  });

  test("has lifecycle hooks defined", () => {
    const integration = linkedinIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
