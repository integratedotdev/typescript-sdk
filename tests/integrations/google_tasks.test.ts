import { describe, test, expect } from "bun:test";
import { googleTasksIntegration } from "../../src/integrations/google_tasks.js";

describe("Google Tasks Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = googleTasksIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("google_tasks");
    expect(integration.name).toBe("Google Tasks");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThanOrEqual(12);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Productivity");
  });

  test("includes OAuth configuration", () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("google_tasks");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/tasks"],
    });

    expect(integration.oauth?.scopes).toEqual(["https://www.googleapis.com/auth/tasks"]);
  });

  test("includes expected tools", () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("google_tasks_list_tasklists");
    expect(integration.tools).toContain("google_tasks_create_task");
    expect(integration.tools).toContain("google_tasks_move_task");
    expect(integration.tools).not.toContain("google_tasks_api_request");
  });

  test("has lifecycle hooks defined", () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = googleTasksIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as never)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as never)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GOOGLE_TASKS_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_TASKS_CLIENT_SECRET;

    process.env.GOOGLE_TASKS_CLIENT_ID = "env-client-id";
    process.env.GOOGLE_TASKS_CLIENT_SECRET = "env-client-secret";

    const integration = googleTasksIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GOOGLE_TASKS_CLIENT_ID;
    else process.env.GOOGLE_TASKS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GOOGLE_TASKS_CLIENT_SECRET;
    else process.env.GOOGLE_TASKS_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GOOGLE_TASKS_CLIENT_ID = "env-id";

    const integration = googleTasksIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GOOGLE_TASKS_CLIENT_ID;
  });
});
