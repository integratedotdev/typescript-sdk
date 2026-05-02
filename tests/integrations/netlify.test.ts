import { describe, test, expect } from "bun:test";
import { netlifyIntegration } from "../../src/integrations/netlify.js";

describe("Netlify Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = netlifyIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("netlify");
    expect(integration.name).toBe("Netlify");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = netlifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("netlify");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("has empty scopes (Netlify grants full access without scopes)", () => {
    const integration = netlifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toEqual([]);
  });

  test("includes expected tools", () => {
    const integration = netlifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("netlify_list_sites");
    expect(integration.tools).toContain("netlify_get_site");
    expect(integration.tools).toContain("netlify_trigger_build");
    expect(integration.tools).toContain("netlify_list_env_vars");
    expect(integration.tools).toContain("netlify_purge_cache");
  });

  test("has lifecycle hooks defined", () => {
    const integration = netlifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = netlifyIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.NETLIFY_CLIENT_ID;
    const originalSecret = process.env.NETLIFY_CLIENT_SECRET;

    process.env.NETLIFY_CLIENT_ID = "env-client-id";
    process.env.NETLIFY_CLIENT_SECRET = "env-client-secret";

    const integration = netlifyIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.NETLIFY_CLIENT_ID;
    else process.env.NETLIFY_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.NETLIFY_CLIENT_SECRET;
    else process.env.NETLIFY_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.NETLIFY_CLIENT_ID = "env-id";

    const integration = netlifyIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.NETLIFY_CLIENT_ID;
  });
});
