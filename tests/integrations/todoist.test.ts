import { describe, test, expect } from "bun:test";
import { todoistIntegration } from "../../src/integrations/todoist.js";

describe("Todoist Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = todoistIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("todoist");
    expect(integration.name).toBe("Todoist");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeUndefined();
    expect(integration.category).toBeUndefined();
  });

  test("includes OAuth configuration", () => {
    const integration = todoistIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("todoist");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("accepts custom scopes", () => {
    const integration = todoistIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["data:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["data:read"]);
  });

  test("includes expected tools", () => {
    const integration = todoistIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("todoist_list_projects");
    expect(integration.tools).toContain("todoist_create_task");
    expect(integration.tools).toContain("todoist_list_tasks");
    expect(integration.tools).toContain("todoist_complete_task");
  });

  test("has lifecycle hooks defined", () => {
    const integration = todoistIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = todoistIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.TODOIST_CLIENT_ID;
    const originalSecret = process.env.TODOIST_CLIENT_SECRET;

    process.env.TODOIST_CLIENT_ID = "env-client-id";
    process.env.TODOIST_CLIENT_SECRET = "env-client-secret";

    const integration = todoistIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.TODOIST_CLIENT_ID;
    else process.env.TODOIST_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.TODOIST_CLIENT_SECRET;
    else process.env.TODOIST_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.TODOIST_CLIENT_ID = "env-id";

    const integration = todoistIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.TODOIST_CLIENT_ID;
  });
});
