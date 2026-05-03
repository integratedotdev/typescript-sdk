import { describe, test, expect } from "bun:test";
import { gsheetsIntegration } from "../../src/integrations/gsheets.js";

describe("Google Sheets Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gsheetsIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gsheets");
    expect(integration.name).toBe("Google Sheets");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gsheets");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);
  });

  test("includes expected tools", () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gsheets_create");
    expect(integration.tools).toContain("gsheets_get");
    expect(integration.tools).toContain("gsheets_get_values");
    expect(integration.tools).toContain("gsheets_update_values");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gsheetsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GSHEETS_CLIENT_ID;
    const originalSecret = process.env.GSHEETS_CLIENT_SECRET;

    process.env.GSHEETS_CLIENT_ID = "env-client-id";
    process.env.GSHEETS_CLIENT_SECRET = "env-client-secret";

    const integration = gsheetsIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GSHEETS_CLIENT_ID;
    else process.env.GSHEETS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GSHEETS_CLIENT_SECRET;
    else process.env.GSHEETS_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GSHEETS_CLIENT_ID = "env-id";

    const integration = gsheetsIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GSHEETS_CLIENT_ID;
  });
});
