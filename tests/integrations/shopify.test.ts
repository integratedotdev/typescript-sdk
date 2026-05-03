import { describe, test, expect } from "bun:test";
import { shopifyIntegration } from "../../src/integrations/shopify.js";

describe("Shopify Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = shopifyIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("shopify");
    expect(integration.name).toBe("Shopify");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("uses default scopes and shop config", () => {
    const integration = shopifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      shop: "my-store",
    });

    expect(integration.oauth?.scopes).toContain("read_products");
    expect(integration.oauth?.config).toMatchObject({
      subdomain: "my-store",
    });
  });

  test("reads shop from environment when unset", () => {
    const original = process.env.SHOPIFY_SHOP;
    process.env.SHOPIFY_SHOP = "env-store";

    const integration = shopifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.config).toMatchObject({
      subdomain: "env-store",
    });

    if (original === undefined) delete process.env.SHOPIFY_SHOP;
    else process.env.SHOPIFY_SHOP = original;
  });

  test("includes expected tools", () => {
    const integration = shopifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("shopify_admin_graphql");
    expect(integration.tools).toContain("shopify_rest_get");
    expect(integration.tools).toContain("shopify_rest_post");
    expect(integration.tools).toContain("shopify_get_shop");
  });
});
