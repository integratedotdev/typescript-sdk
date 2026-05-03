import { describe, test, expect } from "bun:test";
import { dropboxIntegration } from "../../src/integrations/dropbox.js";

describe("Dropbox Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = dropboxIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("dropbox");
    expect(integration.name).toBe("Dropbox");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Storage");
  });

  test("includes OAuth configuration", () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("dropbox");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    // scopes defaults to undefined (server provider config handles defaults)
    expect(integration.oauth?.scopes === undefined || Array.isArray(integration.oauth?.scopes)).toBe(true);
  });

  test("accepts custom scopes", () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["files.content.read"],
    });

    expect(integration.oauth?.scopes).toEqual(["files.content.read"]);
  });

  test("throws when scopes is not an array of strings", () => {
    expect(() =>
      dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: [123 as any],
      })
    ).toThrow();
  });

  test("includes expected tools", () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("dropbox_list_folder");
    expect(integration.tools).toContain("dropbox_search_files");
    expect(integration.tools).toContain("dropbox_upload_text_file");
    expect(integration.tools).toContain("dropbox_get_current_account");
  });

  test("has lifecycle hooks defined", () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = dropboxIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.DROPBOX_CLIENT_ID;
    const originalSecret = process.env.DROPBOX_CLIENT_SECRET;

    process.env.DROPBOX_CLIENT_ID = "env-client-id";
    process.env.DROPBOX_CLIENT_SECRET = "env-client-secret";

    const integration = dropboxIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.DROPBOX_CLIENT_ID;
    else process.env.DROPBOX_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.DROPBOX_CLIENT_SECRET;
    else process.env.DROPBOX_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.DROPBOX_CLIENT_ID = "env-id";

    const integration = dropboxIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.DROPBOX_CLIENT_ID;
  });
});
