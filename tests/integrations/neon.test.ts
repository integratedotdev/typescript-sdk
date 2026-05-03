import { describe, test, expect } from "bun:test";
import { neonIntegration } from "../../src/integrations/neon.js";

describe("Neon Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = neonIntegration({ apiKey: "test-api-key" });

    expect(integration.id).toBe("neon");
    expect(integration.name).toBe("Neon");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Infrastructure");
  });

  test("throws without credentials", () => {
    const orig = process.env.NEON_API_KEY;
    delete process.env.NEON_API_KEY;

    expect(() => neonIntegration()).toThrow();

    if (orig !== undefined) process.env.NEON_API_KEY = orig;
    else delete process.env.NEON_API_KEY;
  });

  test("getHeaders returns Bearer token header", () => {
    const integration = neonIntegration({ apiKey: "my-neon-key" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my-neon-key",
    });
  });

  test("includes expected tools", () => {
    const integration = neonIntegration({ apiKey: "test-key" });

    expect(integration.tools).toContain("neon_list_projects");
    expect(integration.tools).toContain("neon_create_project");
    expect(integration.tools).toContain("neon_list_branches");
    expect(integration.tools).toContain("neon_get_connection_uri");
  });

  test("has lifecycle hooks defined", () => {
    const integration = neonIntegration({ apiKey: "test-key" });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = neonIntegration({ apiKey: "test-key" });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const orig = process.env.NEON_API_KEY;
    process.env.NEON_API_KEY = "env-neon-key";

    const integration = neonIntegration();

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-neon-key",
    });

    if (orig === undefined) delete process.env.NEON_API_KEY;
    else process.env.NEON_API_KEY = orig;
  });

  test("explicit config overrides environment variables", () => {
    process.env.NEON_API_KEY = "env-key";

    const integration = neonIntegration({ apiKey: "explicit-key" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer explicit-key",
    });

    delete process.env.NEON_API_KEY;
  });
});
