import { describe, test, expect } from "bun:test";
import { betterstackIntegration } from "../../src/integrations/betterstack.js";

describe("Better Stack Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = betterstackIntegration({
      apiKey: "bs_test_token",
    });

    expect(integration.id).toBe("betterstack");
    expect(integration.name).toBe("Better Stack");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("throws without api key", () => {
    expect(() => betterstackIntegration()).toThrow();
  });

  test("uses apiKey for bearer header", () => {
    const integration = betterstackIntegration({
      apiKey: "telemetry_token",
    });

    expect(integration.authType).toBe("apiKey");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer telemetry_token",
    });
  });

  test("includes expected tools", () => {
    const integration = betterstackIntegration({ apiKey: "k" });

    expect(integration.tools).toContain("betterstack_list_sources");
    expect(integration.tools).toContain("betterstack_get_source");
    expect(integration.tools).toContain("betterstack_ingest_logs");
  });

  test("has lifecycle hooks defined", () => {
    const integration = betterstackIntegration({ apiKey: "k" });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = betterstackIntegration({ apiKey: "k" });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const original = process.env.BETTERSTACK_API_KEY;

    process.env.BETTERSTACK_API_KEY = "env-token";

    const integration = betterstackIntegration();

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-token",
    });

    if (original === undefined) delete process.env.BETTERSTACK_API_KEY;
    else process.env.BETTERSTACK_API_KEY = original;
  });

  test("explicit config overrides environment variables", () => {
    process.env.BETTERSTACK_API_KEY = "env-id";

    const integration = betterstackIntegration({
      apiKey: "explicit-key",
    });

    expect(integration.getHeaders?.()?.Authorization).toBe("Bearer explicit-key");

    delete process.env.BETTERSTACK_API_KEY;
  });
});
