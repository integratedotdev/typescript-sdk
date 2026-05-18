import { describe, test, expect } from "bun:test";
import { convexIntegration } from "../../src/integrations/convex.js";

describe("Convex Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = convexIntegration({ accessToken: "test-token" });

    expect(integration.id).toBe("convex");
    expect(integration.name).toBe("Convex");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Engineering");
  });

  test("throws without credentials", () => {
    const orig = process.env.CONVEX_ACCESS_TOKEN;
    delete process.env.CONVEX_ACCESS_TOKEN;

    expect(() => convexIntegration()).toThrow();

    if (orig !== undefined) process.env.CONVEX_ACCESS_TOKEN = orig;
    else delete process.env.CONVEX_ACCESS_TOKEN;
  });

  test("getHeaders returns Bearer token header", () => {
    const integration = convexIntegration({ accessToken: "my-token" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my-token",
    });
  });

  test("includes expected tools", () => {
    const integration = convexIntegration({ accessToken: "test-token" });

    expect(integration.tools).toContain("convex_management_list_projects");
    expect(integration.tools).toContain("convex_management_create_project");
    expect(integration.tools).toContain("convex_management_list_deployments");
    expect(integration.tools).toContain("convex_deployment_list_environment_variables");
  });

  test("has lifecycle hooks defined", () => {
    const integration = convexIntegration({ accessToken: "test-token" });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = convexIntegration({ accessToken: "test-token" });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const orig = process.env.CONVEX_ACCESS_TOKEN;
    process.env.CONVEX_ACCESS_TOKEN = "env-token";

    const integration = convexIntegration();

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-token",
    });

    if (orig === undefined) delete process.env.CONVEX_ACCESS_TOKEN;
    else process.env.CONVEX_ACCESS_TOKEN = orig;
  });

  test("explicit config overrides environment variables", () => {
    process.env.CONVEX_ACCESS_TOKEN = "env-token";

    const integration = convexIntegration({ accessToken: "explicit-token" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer explicit-token",
    });

    delete process.env.CONVEX_ACCESS_TOKEN;
  });
});
