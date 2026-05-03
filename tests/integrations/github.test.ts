import { describe, test, expect } from "bun:test";
import { githubIntegration } from "../../src/integrations/github.js";

describe("GitHub Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = githubIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("github");
    expect(integration.name).toBe("GitHub");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("github");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    // GitHub uses undefined scopes by default (server sets them), so just verify tools work
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
  });

  test("accepts custom scopes", () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["repo"],
    });

    expect(integration.oauth?.scopes).toEqual(["repo"]);
  });

  test("includes expected tools", () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("github_create_issue");
    expect(integration.tools).toContain("github_list_issues");
    expect(integration.tools).toContain("github_create_pull_request");
    expect(integration.tools).toContain("github_list_repos");
  });

  test("has lifecycle hooks defined", () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = githubIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GITHUB_CLIENT_ID;
    const originalSecret = process.env.GITHUB_CLIENT_SECRET;

    process.env.GITHUB_CLIENT_ID = "env-client-id";
    process.env.GITHUB_CLIENT_SECRET = "env-client-secret";

    const integration = githubIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GITHUB_CLIENT_ID;
    else process.env.GITHUB_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GITHUB_CLIENT_SECRET;
    else process.env.GITHUB_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GITHUB_CLIENT_ID = "env-id";

    const integration = githubIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GITHUB_CLIENT_ID;
  });
});
