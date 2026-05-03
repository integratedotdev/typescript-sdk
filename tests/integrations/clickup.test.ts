import { describe, test, expect } from "bun:test";
import { clickupIntegration } from "../../src/integrations/clickup.js";

describe("ClickUp Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = clickupIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("clickup");
    expect(integration.name).toBe("ClickUp");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("clickup");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
  });

  test("accepts custom scopes", () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["read"],
    });

    expect(integration.oauth?.scopes).toEqual(["read"]);
  });

  test("includes expected tools", () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("clickup_list_tasks");
    expect(integration.tools).toContain("clickup_create_task");
    expect(integration.tools).toContain("clickup_get_task");
    expect(integration.tools).toContain("clickup_update_task");
  });

  test("has lifecycle hooks defined", () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = clickupIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.CLICKUP_CLIENT_ID;
    const originalSecret = process.env.CLICKUP_CLIENT_SECRET;

    process.env.CLICKUP_CLIENT_ID = "env-client-id";
    process.env.CLICKUP_CLIENT_SECRET = "env-client-secret";

    const integration = clickupIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.CLICKUP_CLIENT_ID;
    else process.env.CLICKUP_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.CLICKUP_CLIENT_SECRET;
    else process.env.CLICKUP_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.CLICKUP_CLIENT_ID = "env-id";

    const integration = clickupIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.CLICKUP_CLIENT_ID;
  });
});
