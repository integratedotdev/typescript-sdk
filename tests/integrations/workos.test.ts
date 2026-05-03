import { describe, test, expect } from "bun:test";
import { workosIntegration } from "../../src/integrations/workos.js";

describe("WorkOS Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = workosIntegration({
      apiKey: "sk_test_example",
    });

    expect(integration.id).toBe("workos");
    expect(integration.name).toBe("WorkOS");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("throws without api key", () => {
    const original = process.env.WORKOS_API_KEY;
    delete process.env.WORKOS_API_KEY;

    expect(() => workosIntegration()).toThrow();

    if (original !== undefined) process.env.WORKOS_API_KEY = original;
  });

  test("getHeaders returns bearer token", () => {
    const integration = workosIntegration({ apiKey: "sk_secret" });
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sk_secret",
    });
  });

  test("includes expected tools", () => {
    const integration = workosIntegration({ apiKey: "sk_k" });

    expect(integration.tools).toContain("workos_list_organizations");
    expect(integration.tools).toContain("workos_list_users");
    expect(integration.tools).toContain("workos_list_directory_users");
  });

  test("has lifecycle hooks defined", () => {
    const integration = workosIntegration({ apiKey: "sk_k" });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = workosIntegration({ apiKey: "sk_k" });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads api key from environment variables", () => {
    const original = process.env.WORKOS_API_KEY;
    process.env.WORKOS_API_KEY = "env-api-key";

    const integration = workosIntegration();

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-api-key",
    });

    if (original === undefined) delete process.env.WORKOS_API_KEY;
    else process.env.WORKOS_API_KEY = original;
  });
});
