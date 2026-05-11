import { describe, test, expect } from "bun:test";
import { plannerIntegration } from "../../src/integrations/planner.js";

describe("Microsoft Planner Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = plannerIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("planner");
    expect(integration.name).toBe("Microsoft Planner");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration with default scopes", () => {
    const integration = plannerIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("planner");
    expect(integration.oauth?.scopes).toContain("Tasks.ReadWrite");
    expect(integration.oauth?.scopes).toContain("offline_access");
  });

  test("includes expected tools", () => {
    const integration = plannerIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("planner_create_plan");
    expect(integration.tools).toContain("planner_create_task");
    expect(integration.tools).toContain("planner_list_my_tasks");
    expect(integration.tools).toContain("planner_update_task");
  });

  test("does not define lifecycle hooks", () => {
    const integration = plannerIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeUndefined();
    expect(integration.onAfterConnect).toBeUndefined();
  });
});
