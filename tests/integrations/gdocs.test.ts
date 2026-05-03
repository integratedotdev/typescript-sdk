import { describe, test, expect } from "bun:test";
import { gdocsIntegration } from "../../src/integrations/gdocs.js";

describe("Google Docs Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gdocsIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gdocs");
    expect(integration.name).toBe("Google Docs");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gdocs");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/documents"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/documents",
    ]);
  });

  test("includes expected tools", () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gdocs_create");
    expect(integration.tools).toContain("gdocs_get");
    expect(integration.tools).toContain("gdocs_append_text");
    expect(integration.tools).toContain("gdocs_replace_text");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gdocsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GDOCS_CLIENT_ID;
    const originalSecret = process.env.GDOCS_CLIENT_SECRET;

    process.env.GDOCS_CLIENT_ID = "env-client-id";
    process.env.GDOCS_CLIENT_SECRET = "env-client-secret";

    const integration = gdocsIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GDOCS_CLIENT_ID;
    else process.env.GDOCS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GDOCS_CLIENT_SECRET;
    else process.env.GDOCS_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GDOCS_CLIENT_ID = "env-id";

    const integration = gdocsIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GDOCS_CLIENT_ID;
  });
});
