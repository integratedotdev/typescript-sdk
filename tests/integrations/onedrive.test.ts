import { describe, test, expect } from "bun:test";
import { onedriveIntegration } from "../../src/integrations/onedrive.js";

describe("OneDrive Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = onedriveIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("onedrive");
    expect(integration.name).toBe("OneDrive");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("onedrive");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["Files.Read"],
    });

    expect(integration.oauth?.scopes).toEqual(["Files.Read"]);
  });

  test("includes expected tools", () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("onedrive_list_files");
    expect(integration.tools).toContain("onedrive_upload_file");
    expect(integration.tools).toContain("onedrive_share_file");
    expect(integration.tools).toContain("onedrive_search_files");
  });

  test("has lifecycle hooks defined", () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = onedriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.ONEDRIVE_CLIENT_ID;
    const originalSecret = process.env.ONEDRIVE_CLIENT_SECRET;

    process.env.ONEDRIVE_CLIENT_ID = "env-client-id";
    process.env.ONEDRIVE_CLIENT_SECRET = "env-client-secret";

    const integration = onedriveIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.ONEDRIVE_CLIENT_ID;
    else process.env.ONEDRIVE_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.ONEDRIVE_CLIENT_SECRET;
    else process.env.ONEDRIVE_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.ONEDRIVE_CLIENT_ID = "env-id";

    const integration = onedriveIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.ONEDRIVE_CLIENT_ID;
  });
});
