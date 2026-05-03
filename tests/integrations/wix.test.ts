import { describe, test, expect } from "bun:test";
import { wixIntegration } from "../../src/integrations/wix.js";

describe("Wix Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = wixIntegration({
      apiKey: "test-key",
      siteId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(integration.id).toBe("wix");
    expect(integration.name).toBe("Wix");
    expect(integration.authType).toBe("apiKey");
    expect(integration.tools).toContain("wix_query_products");
    expect(integration.tools).toContain("wix_get_order");
    expect(integration.getHeaders).toBeDefined();
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "test-key",
      "wix-site-id": "550e8400-e29b-41d4-a716-446655440000",
    });
  });

  test("throws without api key", () => {
    expect(() =>
      wixIntegration({
        apiKey: "",
        siteId: "x",
      })
    ).toThrow(/WIX_API_KEY/);
  });

  test("throws without site id", () => {
    expect(() =>
      wixIntegration({
        apiKey: "k",
        siteId: "",
      })
    ).toThrow(/WIX_SITE_ID/);
  });

  test("lifecycle hooks execute", async () => {
    const integration = wixIntegration({
      apiKey: "k",
      siteId: "s",
    });
    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });
});
