import { describe, test, expect } from "bun:test";
import { planetscaleIntegration } from "../../src/integrations/planetscale.js";

describe("PlanetScale Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = planetscaleIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("planetscale");
    expect(integration.name).toBe("PlanetScale");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.category).toBe("Infrastructure");
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = planetscaleIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("planetscale");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = planetscaleIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("database:read_branches");
    expect(integration.oauth?.scopes).toContain("organization:read");
  });

  test("accepts custom scopes", () => {
    const integration = planetscaleIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["organization:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["organization:read"]);
  });

  test("includes expected tools", () => {
    const integration = planetscaleIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("planetscale_list_databases");
    expect(integration.tools).toContain("planetscale_get_database");
    expect(integration.tools).toContain("planetscale_list_branches");
    expect(integration.tools).toContain("planetscale_get_current_user");
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.PLANETSCALE_CLIENT_ID;
    const originalSecret = process.env.PLANETSCALE_CLIENT_SECRET;

    process.env.PLANETSCALE_CLIENT_ID = "env-client-id";
    process.env.PLANETSCALE_CLIENT_SECRET = "env-client-secret";

    const integration = planetscaleIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.PLANETSCALE_CLIENT_ID;
    else process.env.PLANETSCALE_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.PLANETSCALE_CLIENT_SECRET;
    else process.env.PLANETSCALE_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.PLANETSCALE_CLIENT_ID = "env-id";

    const integration = planetscaleIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.PLANETSCALE_CLIENT_ID;
  });
});
