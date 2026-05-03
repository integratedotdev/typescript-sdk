import { describe, test, expect } from "bun:test";
import { attioIntegration } from "../../src/integrations/attio.js";

describe("Attio Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = attioIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("attio");
    expect(integration.name).toBe("Attio");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration with default scopes", () => {
    const integration = attioIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("attio");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect(integration.oauth?.scopes).toContain("record_permission:read-write");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://app.attio.com/authorize",
      token_endpoint: "https://app.attio.com/oauth/token",
    });
  });

  test("accepts custom scopes", () => {
    const integration = attioIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["user_management:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["user_management:read"]);
  });

  test("includes expected tools", () => {
    const integration = attioIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("attio_get_self");
    expect(integration.tools).toContain("attio_query_people");
    expect(integration.tools).toContain("attio_create_company");
    expect(integration.tools).toContain("attio_list_tasks");
  });

  test("has lifecycle hooks defined", () => {
    const integration = attioIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.ATTIO_CLIENT_ID;
    const originalSecret = process.env.ATTIO_CLIENT_SECRET;

    process.env.ATTIO_CLIENT_ID = "env-client-id";
    process.env.ATTIO_CLIENT_SECRET = "env-client-secret";

    const integration = attioIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.ATTIO_CLIENT_ID;
    else process.env.ATTIO_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.ATTIO_CLIENT_SECRET;
    else process.env.ATTIO_CLIENT_SECRET = originalSecret;
  });
});
