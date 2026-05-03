import { describe, test, expect } from "bun:test";
import { railwayIntegration } from "../../src/integrations/railway.js";

describe("Railway Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = railwayIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("railway");
    expect(integration.name).toBe("Railway");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Infrastructure");
  });

  test("uses default Railway OAuth configuration", () => {
    const integration = railwayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("workspace:admin");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://backboard.railway.com/oauth/auth",
      apiBaseUrl: "https://backboard.railway.com/graphql/v2",
    });
  });

  test("allows overriding scopes", () => {
    const integration = railwayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["openid"],
    });

    expect(integration.oauth?.scopes).toEqual(["openid"]);
  });

  test("includes expected tools", () => {
    const integration = railwayIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("railway_list_projects");
    expect(integration.tools).toContain("railway_create_service");
    expect(integration.tools).toContain("railway_get_variables");
    expect(integration.tools).toContain("railway_list_domains");
  });
});
