import { describe, test, expect } from "bun:test";
import { alpacaIntegration } from "../../src/integrations/alpaca.js";

describe("Alpaca Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = alpacaIntegration({
      apiKeyId: "PK_ID",
      apiSecretKey: "SK_SECRET",
    });

    expect(integration.id).toBe("alpaca");
    expect(integration.name).toBe("Alpaca");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Finance");
  });

  test("throws without credentials", () => {
    const origId = process.env.ALPACA_API_KEY_ID;
    const origSecret = process.env.ALPACA_API_SECRET_KEY;
    delete process.env.ALPACA_API_KEY_ID;
    delete process.env.ALPACA_API_SECRET_KEY;

    expect(() => alpacaIntegration()).toThrow();

    if (origId !== undefined) process.env.ALPACA_API_KEY_ID = origId;
    else delete process.env.ALPACA_API_KEY_ID;
    if (origSecret !== undefined) process.env.ALPACA_API_SECRET_KEY = origSecret;
    else delete process.env.ALPACA_API_SECRET_KEY;
  });

  test("getHeaders returns Alpaca key headers", () => {
    const integration = alpacaIntegration({
      apiKeyId: "PK1",
      apiSecretKey: "SK1",
    });
    expect(integration.getHeaders?.()).toEqual({
      "APCA-API-KEY-ID": "PK1",
      "APCA-API-SECRET-KEY": "SK1",
    });
  });

  test("includes expected tools", () => {
    const integration = alpacaIntegration({
      apiKeyId: "PK",
      apiSecretKey: "SK",
    });

    expect(integration.tools).toContain("alpaca_get_account");
    expect(integration.tools).toContain("alpaca_create_order");
    expect(integration.tools).toContain("alpaca_list_orders");
  });

  test("has lifecycle hooks defined", () => {
    const integration = alpacaIntegration({
      apiKeyId: "PK",
      apiSecretKey: "SK",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = alpacaIntegration({
      apiKeyId: "PK",
      apiSecretKey: "SK",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const origId = process.env.ALPACA_API_KEY_ID;
    const origSecret = process.env.ALPACA_API_SECRET_KEY;
    process.env.ALPACA_API_KEY_ID = "env-pk";
    process.env.ALPACA_API_SECRET_KEY = "env-sk";

    const integration = alpacaIntegration();

    expect(integration.getHeaders?.()).toEqual({
      "APCA-API-KEY-ID": "env-pk",
      "APCA-API-SECRET-KEY": "env-sk",
    });

    if (origId === undefined) delete process.env.ALPACA_API_KEY_ID;
    else process.env.ALPACA_API_KEY_ID = origId;
    if (origSecret === undefined) delete process.env.ALPACA_API_SECRET_KEY;
    else process.env.ALPACA_API_SECRET_KEY = origSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.ALPACA_API_KEY_ID = "env-pk";
    process.env.ALPACA_API_SECRET_KEY = "env-sk";

    const integration = alpacaIntegration({
      apiKeyId: "explicit-pk",
      apiSecretKey: "explicit-sk",
    });

    expect(integration.getHeaders?.()).toEqual({
      "APCA-API-KEY-ID": "explicit-pk",
      "APCA-API-SECRET-KEY": "explicit-sk",
    });

    delete process.env.ALPACA_API_KEY_ID;
    delete process.env.ALPACA_API_SECRET_KEY;
  });
});
