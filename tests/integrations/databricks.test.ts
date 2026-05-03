import { describe, test, expect } from "bun:test";
import { databricksIntegration } from "../../src/integrations/databricks.js";

describe("Databricks Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = databricksIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      workspaceHost: "https://dbc-test.cloud.databricks.com",
    });

    expect(integration.id).toBe("databricks");
    expect(integration.name).toBe("Databricks");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      workspaceHost: "dbc-abc.cloud.databricks.com",
    });

    expect(integration.oauth?.provider).toBe("databricks");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect((integration.oauth?.config as Record<string, string>)?.subdomain).toBe(
      "https://dbc-abc.cloud.databricks.com",
    );
  });

  test("uses default scopes when none provided", () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toEqual(["all-apis", "offline_access"]);
  });

  test("accepts custom scopes", () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["sql"],
    });

    expect(integration.oauth?.scopes).toEqual(["sql"]);
  });

  test("includes expected tools", () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("databricks_clusters_list");
    expect(integration.tools).toContain("databricks_jobs_run_now");
  });

  test("has lifecycle hooks defined", () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = databricksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.DATABRICKS_CLIENT_ID;
    const originalSecret = process.env.DATABRICKS_CLIENT_SECRET;
    const originalHost = process.env.DATABRICKS_WORKSPACE_HOST;

    process.env.DATABRICKS_CLIENT_ID = "env-client-id";
    process.env.DATABRICKS_CLIENT_SECRET = "env-client-secret";
    process.env.DATABRICKS_WORKSPACE_HOST = "https://dbc-env.cloud.databricks.com";

    const integration = databricksIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");
    expect((integration.oauth?.config as Record<string, string>)?.subdomain).toBe(
      "https://dbc-env.cloud.databricks.com",
    );

    if (originalId === undefined) delete process.env.DATABRICKS_CLIENT_ID;
    else process.env.DATABRICKS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.DATABRICKS_CLIENT_SECRET;
    else process.env.DATABRICKS_CLIENT_SECRET = originalSecret;
    if (originalHost === undefined) delete process.env.DATABRICKS_WORKSPACE_HOST;
    else process.env.DATABRICKS_WORKSPACE_HOST = originalHost;
  });

  test("explicit config overrides environment variables", () => {
    process.env.DATABRICKS_CLIENT_ID = "env-id";

    const integration = databricksIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.DATABRICKS_CLIENT_ID;
  });
});
