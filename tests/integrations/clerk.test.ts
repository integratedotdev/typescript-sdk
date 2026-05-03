import { describe, test, expect } from "bun:test";
import { clerkIntegration } from "../../src/integrations/clerk.js";
import { createMCPClient } from "../../src/client.js";

describe("Clerk Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = clerkIntegration({
      secretKey: "sk_test_fake",
    });

    expect(integration.id).toBe("clerk");
    expect(integration.name).toBe("Clerk");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("throws without secret key", () => {
    const original = process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_SECRET_KEY;

    expect(() => clerkIntegration()).toThrow();

    if (original !== undefined) process.env.CLERK_SECRET_KEY = original;
  });

  test("getHeaders returns bearer token", () => {
    const integration = clerkIntegration({ secretKey: "sk_test_abc" });
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sk_test_abc",
    });
  });

  test("includes expected tools", () => {
    const integration = clerkIntegration({ secretKey: "sk_test_x" });

    expect(integration.tools).toContain("clerk_list_users");
    expect(integration.tools).toContain("clerk_create_user");
    expect(integration.tools).toContain("clerk_revoke_session");
  });

  test("has lifecycle hooks defined", () => {
    const integration = clerkIntegration({ secretKey: "sk_test_x" });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = clerkIntegration({ secretKey: "sk_test_x" });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads secret from environment variables", () => {
    const original = process.env.CLERK_SECRET_KEY;
    process.env.CLERK_SECRET_KEY = "sk_test_env";

    const integration = clerkIntegration();

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sk_test_env",
    });

    if (original === undefined) delete process.env.CLERK_SECRET_KEY;
    else process.env.CLERK_SECRET_KEY = original;
  });

  test("explicit secretKey overrides environment variables", () => {
    process.env.CLERK_SECRET_KEY = "sk_test_env";

    const integration = clerkIntegration({ secretKey: "sk_test_explicit" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer sk_test_explicit",
    });

    delete process.env.CLERK_SECRET_KEY;
  });

  test("MCPClient exposes clerk namespace when configured", () => {
    const client = createMCPClient({
      integrations: [clerkIntegration({ secretKey: "sk_test_x" })],
    });

    expect(client.clerk).toBeDefined();
    expect(typeof client.clerk!.listUsers).toBe("function");
  });
});
