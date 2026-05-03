import { describe, test, expect } from "bun:test";
import { redisIntegration, encodeRedisCloudBearerToken } from "../../src/integrations/redis.js";

describe("Redis Cloud Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = redisIntegration({
      accountKey: "test-account",
      secretKey: "test-secret",
    });

    expect(integration.id).toBe("redis");
    expect(integration.name).toBe("Redis Cloud");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Infrastructure");
  });

  test("uses apiKey auth and encodes bearer for MCP", () => {
    const integration = redisIntegration({
      accountKey: "ak",
      secretKey: "sk",
    });
    expect(integration.authType).toBe("apiKey");
    const h = integration.getHeaders?.();
    expect(h?.Authorization?.startsWith("Bearer redis_cloud:")).toBe(true);
  });

  test("encodeRedisCloudBearerToken round-trips JSON keys", () => {
    const t = encodeRedisCloudBearerToken("a", "b");
    expect(t.startsWith("redis_cloud:")).toBe(true);
  });

  test("includes expected tools", () => {
    const integration = redisIntegration({
      accountKey: "a",
      secretKey: "b",
    });
    expect(integration.tools).toContain("redis_get_task");
    expect(integration.tools).toContain("redis_list_logs");
  });

  test("has lifecycle hooks defined", () => {
    const integration = redisIntegration({
      accountKey: "a",
      secretKey: "b",
    });
    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = redisIntegration({
      accountKey: "a",
      secretKey: "b",
    });
    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalA = process.env.REDIS_CLOUD_ACCOUNT_KEY;
    const originalS = process.env.REDIS_CLOUD_SECRET_KEY;

    process.env.REDIS_CLOUD_ACCOUNT_KEY = "env-a";
    process.env.REDIS_CLOUD_SECRET_KEY = "env-s";

    const integration = redisIntegration();

    const h = integration.getHeaders?.()?.Authorization;
    expect(h).toContain("redis_cloud:");

    if (originalA === undefined) delete process.env.REDIS_CLOUD_ACCOUNT_KEY;
    else process.env.REDIS_CLOUD_ACCOUNT_KEY = originalA;
    if (originalS === undefined) delete process.env.REDIS_CLOUD_SECRET_KEY;
    else process.env.REDIS_CLOUD_SECRET_KEY = originalS;
  });

  test("explicit config is used when provided", () => {
    process.env.REDIS_CLOUD_ACCOUNT_KEY = "env-a";
    process.env.REDIS_CLOUD_SECRET_KEY = "env-s";

    const integration = redisIntegration({
      accountKey: "explicit-a",
      secretKey: "explicit-s",
    });

    const h = integration.getHeaders?.()?.Authorization;
    expect(h).toBe(`Bearer ${encodeRedisCloudBearerToken("explicit-a", "explicit-s")}`);

    delete process.env.REDIS_CLOUD_ACCOUNT_KEY;
    delete process.env.REDIS_CLOUD_SECRET_KEY;
  });
});
