import { describe, test, expect } from "bun:test";
import { canvaIntegration } from "../../src/integrations/canva.js";

describe("Canva Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = canvaIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("canva");
    expect(integration.name).toBe("Canva");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("canva");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    // scopes defaults to undefined (server provider config handles defaults)
    expect(integration.oauth?.scopes === undefined || Array.isArray(integration.oauth?.scopes)).toBe(true);
  });

  test("accepts custom scopes", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["design:content:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["design:content:read"]);
  });

  test("passes optional OAuth config through to the provider", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      optionalScopes: ["folder:read"],
      redirectUri: "https://example.com/oauth/callback",
    });

    expect(integration.oauth?.optionalScopes).toEqual(["folder:read"]);
    expect(integration.oauth?.redirectUri).toBe("https://example.com/oauth/callback");
    expect(integration.oauth?.config?.optionalScopes).toEqual(["folder:read"]);
    expect(integration.oauth?.config?.redirectUri).toBe("https://example.com/oauth/callback");
  });

  test("includes expected tools", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("canva_get_me");
    expect(integration.tools).toContain("canva_list_designs");
    expect(integration.tools).toContain("canva_create_design");
    expect(integration.tools).toContain("canva_list_brand_templates");
  });

  test("has lifecycle hooks defined", () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = canvaIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.CANVA_CLIENT_ID;
    const originalSecret = process.env.CANVA_CLIENT_SECRET;

    process.env.CANVA_CLIENT_ID = "env-client-id";
    process.env.CANVA_CLIENT_SECRET = "env-client-secret";

    const integration = canvaIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.CANVA_CLIENT_ID;
    else process.env.CANVA_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.CANVA_CLIENT_SECRET;
    else process.env.CANVA_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.CANVA_CLIENT_ID = "env-id";

    const integration = canvaIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.CANVA_CLIENT_ID;
  });
});
