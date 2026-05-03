import { describe, test, expect } from "bun:test";
import { tiktokIntegration } from "../../src/integrations/tiktok.js";

describe("TikTok Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = tiktokIntegration({
      clientId: "test-client-key",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("tiktok");
    expect(integration.name).toBe("TikTok");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("tiktok");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("user.info.basic");
    expect(integration.oauth?.scopes).toContain("video.list");
  });

  test("accepts custom scopes", () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["user.info.basic"],
    });

    expect(integration.oauth?.scopes).toEqual(["user.info.basic"]);
  });

  test("includes expected tools", () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("tiktok_get_user_info");
    expect(integration.tools).toContain("tiktok_list_videos");
    expect(integration.tools).toContain("tiktok_query_videos");
  });

  test("has lifecycle hooks defined", () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = tiktokIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.TIKTOK_CLIENT_ID;
    const originalSecret = process.env.TIKTOK_CLIENT_SECRET;

    process.env.TIKTOK_CLIENT_ID = "env-client-id";
    process.env.TIKTOK_CLIENT_SECRET = "env-client-secret";

    const integration = tiktokIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.TIKTOK_CLIENT_ID;
    else process.env.TIKTOK_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.TIKTOK_CLIENT_SECRET;
    else process.env.TIKTOK_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.TIKTOK_CLIENT_ID = "env-id";

    const integration = tiktokIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.TIKTOK_CLIENT_ID;
  });
});
