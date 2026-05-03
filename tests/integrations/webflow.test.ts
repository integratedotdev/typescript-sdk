import { describe, test, expect } from "bun:test";
import { webflowIntegration } from "../../src/integrations/webflow.js";

describe("Webflow Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = webflowIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("webflow");
    expect(integration.name).toBe("Webflow");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Engineering");
  });

  test("uses default scopes and oauth endpoints", () => {
    const integration = webflowIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("cms:read");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://webflow.com/oauth/authorize",
      token_endpoint: "https://api.webflow.com/oauth/access_token",
    });
  });

  test("includes expected tools", () => {
    const integration = webflowIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("webflow_list_sites");
    expect(integration.tools).toContain("webflow_list_site_collections");
    expect(integration.tools).toContain("webflow_create_collection_items");
    expect(integration.tools).toContain("webflow_publish_site");
  });
});
