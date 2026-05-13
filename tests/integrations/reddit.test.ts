import { describe, test, expect } from "bun:test";
import { redditIntegration } from "../../src/integrations/reddit.js";

describe("Reddit Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = redditIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("reddit");
    expect(integration.name).toBe("Reddit");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("uses default scopes", () => {
    const integration = redditIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("reddit");
    expect(integration.oauth?.scopes).toEqual([
      "identity",
      "read",
      "submit",
      "vote",
      "mysubreddits",
    ]);
  });

  test("includes expected tools", () => {
    const integration = redditIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("reddit_get_me");
    expect(integration.tools).toContain("reddit_search");
    expect(integration.tools).toContain("reddit_submit_post");
    expect(integration.tools).toContain("reddit_vote");
  });

  test("does not define lifecycle hooks", () => {
    const integration = redditIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeUndefined();
    expect(integration.onAfterConnect).toBeUndefined();
  });
});
