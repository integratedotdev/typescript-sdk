import { describe, test, expect } from "bun:test";
import { zapierIntegration } from "../../src/integrations/zapier.js";

describe("Zapier Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = zapierIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("zapier");
    expect(integration.name).toBe("Zapier");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = zapierIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("zapier");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect(integration.oauth?.config?.authorization_endpoint).toBe("https://zapier.com/oauth/authorize/");
    expect(integration.oauth?.config?.token_endpoint).toBe("https://zapier.com/oauth/token/");
  });

  test("has empty default scopes", () => {
    const integration = zapierIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toEqual([]);
  });

  test("includes expected tools", () => {
    const integration = zapierIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    const expected = [
      "zapier_get_profile",
      "zapier_list_zaps",
      "zapier_list_apps",
      "zapier_list_actions",
      "zapier_list_authentications",
      "zapier_list_zap_runs",
    ] as const;
    expect(integration.tools).toEqual(expected);
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = zapierIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });
});
