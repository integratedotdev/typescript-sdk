import { describe, test, expect } from "bun:test";
import { jiraIntegration } from "../../src/integrations/jira.js";

describe("Jira Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = jiraIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("jira");
    expect(integration.name).toBe("Jira");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("jira");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("read:jira-work");
    expect(integration.oauth?.scopes).toContain("write:jira-work");
    expect(integration.oauth?.scopes).toContain("offline_access");
  });

  test("accepts custom scopes", () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["read:jira-work"],
    });

    expect(integration.oauth?.scopes).toEqual(["read:jira-work"]);
  });

  test("includes expected tools", () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("jira_list_projects");
    expect(integration.tools).toContain("jira_search_issues");
    expect(integration.tools).toContain("jira_create_issue");
    expect(integration.tools).toContain("jira_transition_issue");
    expect(integration.tools).toContain("jira_list_boards");
    expect(integration.tools).toContain("jira_list_sprints");
  });

  test("has lifecycle hooks defined", () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = jiraIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.JIRA_CLIENT_ID;
    const originalSecret = process.env.JIRA_CLIENT_SECRET;

    process.env.JIRA_CLIENT_ID = "env-client-id";
    process.env.JIRA_CLIENT_SECRET = "env-client-secret";

    const integration = jiraIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.JIRA_CLIENT_ID;
    else process.env.JIRA_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.JIRA_CLIENT_SECRET;
    else process.env.JIRA_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.JIRA_CLIENT_ID = "env-id";

    const integration = jiraIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.JIRA_CLIENT_ID;
  });
});
