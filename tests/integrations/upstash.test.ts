import { describe, expect, test } from "bun:test";
import { upstashIntegration } from "../../src/integrations/upstash.js";

describe("upstashIntegration", () => {
  test("creates integration with Redis + QStash", () => {
    const integration = upstashIntegration({
      redisUrl: "https://us1-test.upstash.io",
      redisToken: "rtoken",
      qstashToken: "qtoken",
    });
    expect(integration.id).toBe("upstash");
    expect(integration.authType).toBe("apiKey");
    expect(integration.tools).toContain("upstash_redis_get");
    expect(integration.tools).toContain("upstash_qstash_publish");
    const h = integration.getHeaders!();
    expect(h["X-Upstash-Redis-Rest-Url"]).toBe("https://us1-test.upstash.io");
    expect(h["X-Upstash-Redis-Rest-Token"]).toBe("rtoken");
    expect(h["X-Qstash-Token"]).toBe("qtoken");
  });

  test("QStash-only", () => {
    const integration = upstashIntegration({ qstashToken: "q" });
    const h = integration.getHeaders!();
    expect(h["X-Qstash-Token"]).toBe("q");
    expect(h["X-Upstash-Redis-Rest-Url"]).toBeUndefined();
  });

  test("throws when no credentials", () => {
    expect(() => upstashIntegration({})).toThrow();
  });

  test("throws on partial Redis config", () => {
    expect(() => upstashIntegration({ redisUrl: "https://x" })).toThrow();
  });
});
