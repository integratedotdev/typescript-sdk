import { describe, test, expect } from "bun:test";
import { instagramIntegration } from "../../src/integrations/instagram.js";

describe("Instagram Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = instagramIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("instagram");
    expect(integration.name).toBe("Instagram");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Social Media");
  });

  test("includes OAuth configuration", () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("instagram");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("instagram_basic");
  });

  test("accepts custom scopes", () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["pages_show_list"],
    });

    expect(integration.oauth?.scopes).toEqual(["pages_show_list"]);
  });

  test("includes expected tools", () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("instagram_list_pages");
    expect(integration.tools).toContain("instagram_list_media");
    expect(integration.tools).toContain("instagram_publish_media");
  });

  test("has lifecycle hooks defined", () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = instagramIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.INSTAGRAM_CLIENT_ID;
    const originalSecret = process.env.INSTAGRAM_CLIENT_SECRET;

    process.env.INSTAGRAM_CLIENT_ID = "env-client-id";
    process.env.INSTAGRAM_CLIENT_SECRET = "env-client-secret";

    const integration = instagramIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.INSTAGRAM_CLIENT_ID;
    else process.env.INSTAGRAM_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.INSTAGRAM_CLIENT_SECRET;
    else process.env.INSTAGRAM_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.INSTAGRAM_CLIENT_ID = "env-id";

    const integration = instagramIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.INSTAGRAM_CLIENT_ID;
  });
});
