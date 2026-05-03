import { describe, test, expect } from "bun:test";
import { facebookIntegration } from "../../src/integrations/facebook.js";

describe("Facebook Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = facebookIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("facebook");
    expect(integration.name).toBe("Facebook");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("facebook");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://www.facebook.com/v18.0/dialog/oauth",
      token_endpoint: "https://graph.facebook.com/v18.0/oauth/access_token",
    });
  });

  test("uses default scopes when none provided", () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("pages_manage_posts");
  });

  test("accepts custom scopes", () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["public_profile", "pages_show_list"],
    });

    expect(integration.oauth?.scopes).toEqual(["public_profile", "pages_show_list"]);
  });

  test("includes expected tools", () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("facebook_get_me");
    expect(integration.tools).toContain("facebook_list_pages");
    expect(integration.tools).toContain("facebook_create_page_post");
  });

  test("has lifecycle hooks defined", () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = facebookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.FACEBOOK_CLIENT_ID;
    const originalSecret = process.env.FACEBOOK_CLIENT_SECRET;

    process.env.FACEBOOK_CLIENT_ID = "env-client-id";
    process.env.FACEBOOK_CLIENT_SECRET = "env-client-secret";

    const integration = facebookIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.FACEBOOK_CLIENT_ID;
    else process.env.FACEBOOK_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.FACEBOOK_CLIENT_SECRET;
    else process.env.FACEBOOK_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.FACEBOOK_CLIENT_ID = "env-id";

    const integration = facebookIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.FACEBOOK_CLIENT_ID;
  });
});
