import { describe, test, expect } from "bun:test";
import { ga4Integration } from "../../src/integrations/ga4.js";

describe("GA4 Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = ga4Integration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("ga4");
    expect(integration.name).toBe("Google Analytics 4");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = ga4Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("ga4");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = ga4Integration({
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
    const integration = ga4Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/analytics"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/analytics",
    ]);
  });

  test("includes expected tools", () => {
    const integration = ga4Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("ga4_run_report");
    expect(integration.tools).toContain("ga4_list_account_summaries");
    expect(integration.tools).toContain("ga4_get_property");
    expect(integration.tools).toContain("ga4_run_realtime_report");
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GA4_CLIENT_ID;
    const originalSecret = process.env.GA4_CLIENT_SECRET;

    process.env.GA4_CLIENT_ID = "env-client-id";
    process.env.GA4_CLIENT_SECRET = "env-client-secret";

    const integration = ga4Integration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GA4_CLIENT_ID;
    else process.env.GA4_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GA4_CLIENT_SECRET;
    else process.env.GA4_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GA4_CLIENT_ID = "env-id";

    const integration = ga4Integration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GA4_CLIENT_ID;
  });
});
