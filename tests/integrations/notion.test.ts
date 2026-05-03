import { describe, test, expect } from "bun:test";
import { notionIntegration } from "../../src/integrations/notion.js";

describe("Notion Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = notionIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("notion");
    expect(integration.name).toBe("Notion");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("notion");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default owner parameter", () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.config).toMatchObject({
      owner: "user",
      authorization_endpoint: "https://api.notion.com/v1/oauth/authorize",
      token_endpoint: "https://api.notion.com/v1/oauth/token",
    });
    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("allows custom owner parameter", () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      owner: "workspace",
    });

    expect(integration.oauth?.config).toMatchObject({
      owner: "workspace",
    });
  });

  test("includes expected tools", () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("notion_search");
    expect(integration.tools).toContain("notion_create_page");
    expect(integration.tools).toContain("notion_query_database");
    expect(integration.tools).toContain("notion_create_file_upload");
  });

  test("has lifecycle hooks defined", () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = notionIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.NOTION_CLIENT_ID;
    const originalSecret = process.env.NOTION_CLIENT_SECRET;

    process.env.NOTION_CLIENT_ID = "env-client-id";
    process.env.NOTION_CLIENT_SECRET = "env-client-secret";

    const integration = notionIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.NOTION_CLIENT_ID;
    else process.env.NOTION_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.NOTION_CLIENT_SECRET;
    else process.env.NOTION_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.NOTION_CLIENT_ID = "env-id";

    const integration = notionIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.NOTION_CLIENT_ID;
  });
});
