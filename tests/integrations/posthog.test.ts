import { describe, test, expect } from "bun:test";
import { posthogIntegration } from "../../src/integrations/posthog.js";

describe("PostHog Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = posthogIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("posthog");
    expect(integration.name).toBe("PostHog");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Analytics");
  });

  test("uses default PostHog OAuth configuration", () => {
    const integration = posthogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("openid");
    expect(integration.oauth?.config).toMatchObject({
      baseUrl: "https://us.posthog.com",
      authorization_endpoint: "https://us.posthog.com/oauth/authorize/",
    });
  });

  test("normalizes custom base urls", () => {
    const integration = posthogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      baseUrl: "eu.posthog.com/",
    });

    expect(integration.oauth?.config).toMatchObject({
      baseUrl: "https://eu.posthog.com",
      apiBaseUrl: "https://eu.posthog.com",
    });
  });

  test("includes expected tools", () => {
    const integration = posthogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("posthog_get_current_user");
    expect(integration.tools).toContain("posthog_list_projects");
    expect(integration.tools).toContain("posthog_run_hogql_query");
    expect(integration.tools).toContain("posthog_list_feature_flags");
  });
});
