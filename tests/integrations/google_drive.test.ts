import { describe, test, expect } from "bun:test";
import { googleDriveIntegration } from "../../src/integrations/google_drive.js";

describe("Google Drive Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = googleDriveIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("google_drive");
    expect(integration.name).toBe("Google Drive");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("google_drive");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/drive.file",
    ]);
  });

  test("includes expected tools", () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("google_drive_list_files");
    expect(integration.tools).toContain("google_drive_upload_text_file");
    expect(integration.tools).toContain("google_drive_share_file");
    expect(integration.tools).toContain("google_drive_download_file");
  });

  test("has lifecycle hooks defined", () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = googleDriveIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;

    process.env.GOOGLE_DRIVE_CLIENT_ID = "env-client-id";
    process.env.GOOGLE_DRIVE_CLIENT_SECRET = "env-client-secret";

    const integration = googleDriveIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GOOGLE_DRIVE_CLIENT_ID;
    else process.env.GOOGLE_DRIVE_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    else process.env.GOOGLE_DRIVE_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GOOGLE_DRIVE_CLIENT_ID = "env-id";

    const integration = googleDriveIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GOOGLE_DRIVE_CLIENT_ID;
  });
});
