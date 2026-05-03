import { describe, test, expect } from "bun:test";
import { threadsIntegration } from "../../src/integrations/threads.js";

describe("Threads Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = threadsIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("threads");
    expect(integration.name).toBe("Threads");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("uses default required and optional scopes", () => {
    const integration = threadsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("threads_basic");
    expect(integration.oauth?.optionalScopes).toContain("threads_keyword_search");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint: "https://threads.net/oauth/authorize",
    });
  });

  test("accepts custom optional scopes", () => {
    const integration = threadsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      optionalScopes: ["threads_manage_mentions"],
    });

    expect(integration.oauth?.optionalScopes).toEqual(["threads_manage_mentions"]);
  });

  test("includes expected tools", () => {
    const integration = threadsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("threads_get_me");
    expect(integration.tools).toContain("threads_keyword_search");
    expect(integration.tools).toContain("threads_publish_media_container");
    expect(integration.tools).toContain("threads_delete_media");
  });
});
