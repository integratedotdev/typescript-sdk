import { describe, test, expect } from "bun:test";
import { linearIntegration } from "../../src/integrations/linear.js";

describe("Linear Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = linearIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("linear");
    expect(integration.name).toBe("Linear");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("linear");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["read"],
    });

    expect(integration.oauth?.scopes).toEqual(["read"]);
  });

  test("includes expected tools", () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("linear_create_issue");
    expect(integration.tools).toContain("linear_list_projects");
    expect(integration.tools).toContain("linear_list_cycles");
    expect(integration.tools).toContain("linear_create_project_update");
  });

  test("has lifecycle hooks defined", () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = linearIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.LINEAR_CLIENT_ID;
    const originalSecret = process.env.LINEAR_CLIENT_SECRET;

    process.env.LINEAR_CLIENT_ID = "env-client-id";
    process.env.LINEAR_CLIENT_SECRET = "env-client-secret";

    const integration = linearIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.LINEAR_CLIENT_ID;
    else process.env.LINEAR_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.LINEAR_CLIENT_SECRET;
    else process.env.LINEAR_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.LINEAR_CLIENT_ID = "env-id";

    const integration = linearIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.LINEAR_CLIENT_ID;
  });
});
