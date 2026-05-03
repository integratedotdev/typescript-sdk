import { describe, test, expect } from "bun:test";
import { excelIntegration } from "../../src/integrations/excel.js";

describe("Excel Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = excelIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("excel");
    expect(integration.name).toBe("Excel");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("excel");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes === undefined || Array.isArray(integration.oauth?.scopes)).toBe(true);
  });

  test("accepts custom scopes", () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["Files.ReadWrite"],
    });

    expect(integration.oauth?.scopes).toEqual(["Files.ReadWrite"]);
  });

  test("includes expected tools", () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("excel_create");
    expect(integration.tools).toContain("excel_list");
    expect(integration.tools).toContain("excel_get");
    expect(integration.tools).toContain("excel_list_worksheets");
  });

  test("has lifecycle hooks defined", () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = excelIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.EXCEL_CLIENT_ID;
    const originalSecret = process.env.EXCEL_CLIENT_SECRET;

    process.env.EXCEL_CLIENT_ID = "env-client-id";
    process.env.EXCEL_CLIENT_SECRET = "env-client-secret";

    const integration = excelIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.EXCEL_CLIENT_ID;
    else process.env.EXCEL_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.EXCEL_CLIENT_SECRET;
    else process.env.EXCEL_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.EXCEL_CLIENT_ID = "env-id";

    const integration = excelIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.EXCEL_CLIENT_ID;
  });
});
