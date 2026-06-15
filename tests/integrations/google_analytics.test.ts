import { describe, test, expect } from "bun:test";
import { googleAnalyticsIntegration } from "../../src/integrations/google_analytics.js";

describe("GA4 Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = googleAnalyticsIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("google_analytics");
    expect(integration.name).toBe("Google Analytics");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = googleAnalyticsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("google_analytics");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = googleAnalyticsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain(
      "https://www.googleapis.com/auth/analytics.readonly"
    );
  });

  test("accepts custom scopes", () => {
    const integration = googleAnalyticsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/analytics"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/analytics",
    ]);
  });

  test("includes expected tools", () => {
    const integration = googleAnalyticsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("google_analytics_run_report");
    expect(integration.tools).toContain("google_analytics_list_account_summaries");
    expect(integration.tools).toContain("google_analytics_get_property");
    expect(integration.tools).toContain("google_analytics_run_realtime_report");
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GOOGLE_ANALYTICS_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET;

    process.env.GOOGLE_ANALYTICS_CLIENT_ID = "env-client-id";
    process.env.GOOGLE_ANALYTICS_CLIENT_SECRET = "env-client-secret";

    const integration = googleAnalyticsIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GOOGLE_ANALYTICS_CLIENT_ID;
    else process.env.GOOGLE_ANALYTICS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GOOGLE_ANALYTICS_CLIENT_SECRET;
    else process.env.GOOGLE_ANALYTICS_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GOOGLE_ANALYTICS_CLIENT_ID = "env-id";

    const integration = googleAnalyticsIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GOOGLE_ANALYTICS_CLIENT_ID;
  });
});
