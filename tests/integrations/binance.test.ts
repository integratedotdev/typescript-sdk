import { describe, test, expect } from "bun:test";
import { binanceIntegration } from "../../src/integrations/binance.js";

describe("Binance Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = binanceIntegration({
      apiKey: "pk_test",
      secret: "sk_test",
    });

    expect(integration.id).toBe("binance");
    expect(integration.name).toBe("Binance");
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.category).toBe("Finance");
  });

  test("throws without credentials", () => {
    const ak = process.env.BINANCE_API_KEY;
    const sk = process.env.BINANCE_SECRET_KEY;
    delete process.env.BINANCE_API_KEY;
    delete process.env.BINANCE_SECRET_KEY;

    expect(() => binanceIntegration()).toThrow();

    if (ak !== undefined) process.env.BINANCE_API_KEY = ak;
    else delete process.env.BINANCE_API_KEY;
    if (sk !== undefined) process.env.BINANCE_SECRET_KEY = sk;
    else delete process.env.BINANCE_SECRET_KEY;
  });

  test("getHeaders includes signing headers", () => {
    const integration = binanceIntegration({
      apiKey: "my_key",
      secret: "my_secret",
      baseUrl: "https://testnet.binance.vision",
    });
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my_key",
      "X-MBX-APIKEY": "my_key",
      "X-Binance-Api-Secret": "my_secret",
      "X-Binance-Base-Url": "https://testnet.binance.vision",
    });
  });

  test("includes expected tools", () => {
    const integration = binanceIntegration({ apiKey: "k", secret: "s" });
    expect(integration.tools).toContain("binance_ping");
    expect(integration.tools).toContain("binance_get_account");
    expect(integration.tools).toContain("binance_get_my_trades");
  });
});
