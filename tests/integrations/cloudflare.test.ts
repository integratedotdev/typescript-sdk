import { describe, test, expect } from "bun:test";
import { cloudflareIntegration } from "../../src/integrations/cloudflare.js";

describe("Cloudflare Integration", () => {
  test("creates OAuth integration with expected tools", () => {
    const integration = cloudflareIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("cloudflare");
    expect(integration.name).toBe("Cloudflare");
    expect(integration.oauth?.provider).toBe("cloudflare");
    expect(integration.tools).toContain("cloudflare_list_zones");
    expect(integration.tools).toContain("cloudflare_verify_token");
    expect(integration.tools).toContain("cloudflare_purge_zone_cache");
  });

  test("uses API token mode when apiToken is set", () => {
    const integration = cloudflareIntegration({ apiToken: "cf_test_token" });

    expect(integration.authType).toBe("apiKey");
    expect(integration.oauth).toBeUndefined();
    expect(integration.getHeaders?.().Authorization).toBe("Bearer cf_test_token");
  });

  test("OAuth config includes Cloudflare dashboard endpoints", () => {
    const integration = cloudflareIntegration({
      clientId: "id",
      clientSecret: "secret",
    });
    const cfg = integration.oauth?.config as Record<string, string>;
    expect(cfg["authorization_endpoint"]).toContain("dash.cloudflare.com/oauth2/auth");
    expect(cfg["token_endpoint"]).toContain("dash.cloudflare.com/oauth2/token");
  });
});
