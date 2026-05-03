import { describe, test, expect } from "bun:test";
import { gitlabIntegration } from "../../src/integrations/gitlab.js";

describe("GitLab Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gitlabIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gitlab");
    expect(integration.name).toBe("GitLab");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Engineering");
  });

  test("includes OAuth configuration", () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gitlab");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain("read_api");
    expect(integration.oauth?.scopes).toContain("write_api");
    expect(integration.oauth?.scopes).toContain("read_user");
  });

  test("accepts custom scopes", () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["read_api"],
    });

    expect(integration.oauth?.scopes).toEqual(["read_api"]);
  });

  test("includes expected tools", () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gitlab_list_projects");
    expect(integration.tools).toContain("gitlab_create_issue");
    expect(integration.tools).toContain("gitlab_create_merge_request");
    expect(integration.tools).toContain("gitlab_get_current_user");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gitlabIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GITLAB_CLIENT_ID;
    const originalSecret = process.env.GITLAB_CLIENT_SECRET;

    process.env.GITLAB_CLIENT_ID = "env-client-id";
    process.env.GITLAB_CLIENT_SECRET = "env-client-secret";

    const integration = gitlabIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GITLAB_CLIENT_ID;
    else process.env.GITLAB_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GITLAB_CLIENT_SECRET;
    else process.env.GITLAB_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GITLAB_CLIENT_ID = "env-id";

    const integration = gitlabIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GITLAB_CLIENT_ID;
  });
});
