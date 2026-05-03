import { describe, test, expect } from "bun:test";
import { supabaseIntegration } from "../../src/integrations/supabase.js";

describe("Supabase Integration", () => {
  test("creates OAuth integration with correct structure", () => {
    const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
    delete process.env.SUPABASE_ACCESS_TOKEN;

    const integration = supabaseIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("supabase");
    expect(integration.name).toBe("Supabase");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.oauth?.provider).toBe("supabase");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();

    if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
    else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
  });

  test("uses PAT mode when accessToken is set", () => {
    const integration = supabaseIntegration({ accessToken: "sbp_test" });

    expect(integration.authType).toBe("apiKey");
    expect(integration.oauth).toBeUndefined();
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sbp_test",
    });
  });

  test("reads PAT from SUPABASE_ACCESS_TOKEN", () => {
    const original = process.env.SUPABASE_ACCESS_TOKEN;
    process.env.SUPABASE_ACCESS_TOKEN = "sbp_env";

    const integration = supabaseIntegration();

    expect(integration.authType).toBe("apiKey");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sbp_env",
    });

    if (original === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
    else process.env.SUPABASE_ACCESS_TOKEN = original;
  });

  test("explicit accessToken overrides env PAT", () => {
    process.env.SUPABASE_ACCESS_TOKEN = "sbp_env";

    const integration = supabaseIntegration({ accessToken: "sbp_explicit" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sbp_explicit",
    });

    delete process.env.SUPABASE_ACCESS_TOKEN;
  });

  test("includes expected tools", () => {
    const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
    delete process.env.SUPABASE_ACCESS_TOKEN;

    const integration = supabaseIntegration({
      clientId: "id",
      clientSecret: "secret",
    });

    expect(integration.tools).toContain("supabase_list_projects");
    expect(integration.tools).toContain("supabase_get_database_postgres_config");
    expect(integration.tools).toContain("supabase_list_project_secrets");

    if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
    else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
  });

  test("has lifecycle hooks defined", () => {
    const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
    delete process.env.SUPABASE_ACCESS_TOKEN;

    const integration = supabaseIntegration({
      clientId: "id",
      clientSecret: "secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();

    if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
    else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
  });

  test("lifecycle hooks execute successfully", async () => {
    const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
    delete process.env.SUPABASE_ACCESS_TOKEN;

    const integration = supabaseIntegration({
      clientId: "id",
      clientSecret: "secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();

    if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
    else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
  });

  test("reads OAuth credentials from environment variables", () => {
    const originalId = process.env.SUPABASE_CLIENT_ID;
    const originalSecret = process.env.SUPABASE_CLIENT_SECRET;

    process.env.SUPABASE_CLIENT_ID = "env-client-id";
    process.env.SUPABASE_CLIENT_SECRET = "env-client-secret";

    const integration = supabaseIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.SUPABASE_CLIENT_ID;
    else process.env.SUPABASE_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.SUPABASE_CLIENT_SECRET;
    else process.env.SUPABASE_CLIENT_SECRET = originalSecret;
  });

  test("explicit OAuth config overrides environment variables", () => {
    process.env.SUPABASE_CLIENT_ID = "env-id";

    const integration = supabaseIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.SUPABASE_CLIENT_ID;
  });
});
