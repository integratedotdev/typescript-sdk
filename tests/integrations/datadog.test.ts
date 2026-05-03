import { describe, test, expect } from "bun:test";
import { datadogIntegration } from "../../src/integrations/datadog.js";

describe("Datadog Integration", () => {
  test("creates OAuth integration with correct structure", () => {
    const integration = datadogIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("datadog");
    expect(integration.name).toBe("Datadog");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("datadog");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("monitors_read");
  });

  test("accepts custom scopes", () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["dashboards_read"],
    });

    expect(integration.oauth?.scopes).toEqual(["dashboards_read"]);
  });

  test("forwards site as OAuth subdomain", () => {
    const integration = datadogIntegration({
      clientId: "id",
      clientSecret: "secret",
      site: "datadoghq.eu",
    });
    expect((integration.oauth?.config as Record<string, string>).subdomain).toBe("datadoghq.eu");
  });

  test("creates API key integration when both keys provided", () => {
    const integration = datadogIntegration({
      apiKey: "dd-api",
      applicationKey: "dd-app",
      site: "datadoghq.com",
    });
    expect(integration.authType).toBe("apiKey");
    expect(integration.oauth).toBeUndefined();
    const h = integration.getHeaders?.() ?? {};
    expect(h["DD-API-KEY"]).toBe("dd-api");
    expect(h["DD-APPLICATION-KEY"]).toBe("dd-app");
    expect(h["DD-SITE"]).toBe("datadoghq.com");
  });

  test("throws when only one API-style key is set", () => {
    const origApi = process.env.DATADOG_API_KEY;
    const origApp = process.env.DATADOG_APPLICATION_KEY;
    delete process.env.DATADOG_API_KEY;
    delete process.env.DATADOG_APPLICATION_KEY;
    try {
      expect(() =>
        datadogIntegration({
          apiKey: "only-api",
        })
      ).toThrow(/both be set/);
    } finally {
      if (origApi === undefined) delete process.env.DATADOG_API_KEY;
      else process.env.DATADOG_API_KEY = origApi;
      if (origApp === undefined) delete process.env.DATADOG_APPLICATION_KEY;
      else process.env.DATADOG_APPLICATION_KEY = origApp;
    }
  });

  test("includes expected tools", () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });
    expect(integration.tools).toContain("datadog_list_monitors");
    expect(integration.tools).toContain("datadog_search_logs");
  });

  test("has lifecycle hooks defined", () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });
    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = datadogIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });
    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads OAuth credentials from environment variables", () => {
    const originalId = process.env.DATADOG_CLIENT_ID;
    const originalSecret = process.env.DATADOG_CLIENT_SECRET;

    process.env.DATADOG_CLIENT_ID = "env-client-id";
    process.env.DATADOG_CLIENT_SECRET = "env-client-secret";

    const integration = datadogIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.DATADOG_CLIENT_ID;
    else process.env.DATADOG_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.DATADOG_CLIENT_SECRET;
    else process.env.DATADOG_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.DATADOG_CLIENT_ID = "env-id";

    const integration = datadogIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.DATADOG_CLIENT_ID;
  });
});
