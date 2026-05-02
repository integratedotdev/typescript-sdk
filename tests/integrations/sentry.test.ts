import { describe, test, expect } from "bun:test";
import { sentryIntegration } from "../../src/integrations/sentry.js";

describe("Sentry Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = sentryIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("sentry");
    expect(integration.name).toBe("Sentry");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("sentry");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("org:read");
    expect(integration.oauth?.scopes).toContain("event:read");
  });

  test("accepts custom scopes", () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["org:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["org:read"]);
  });

  test("includes expected tools", () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("sentry_get_organization");
    expect(integration.tools).toContain("sentry_list_issues");
    expect(integration.tools).toContain("sentry_update_issue");
    expect(integration.tools).toContain("sentry_create_release");
    expect(integration.tools).toContain("sentry_resolve_short_id");
  });

  test("has lifecycle hooks defined", () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = sentryIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.SENTRY_CLIENT_ID;
    const originalSecret = process.env.SENTRY_CLIENT_SECRET;

    process.env.SENTRY_CLIENT_ID = "env-client-id";
    process.env.SENTRY_CLIENT_SECRET = "env-client-secret";

    const integration = sentryIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.SENTRY_CLIENT_ID;
    else process.env.SENTRY_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.SENTRY_CLIENT_SECRET;
    else process.env.SENTRY_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.SENTRY_CLIENT_ID = "env-id";

    const integration = sentryIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.SENTRY_CLIENT_ID;
  });
});
