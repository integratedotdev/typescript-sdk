/**
 * Integration System Tests
 */

import { describe, test, expect } from "bun:test";
import { githubIntegration } from "../../src/integrations/github.js";
import { gmailIntegration } from "../../src/integrations/gmail.js";
import { notionIntegration } from "../../src/integrations/notion.js";
import { slackIntegration } from "../../src/integrations/slack.js";
import { linearIntegration } from "../../src/integrations/linear.js";
import { vercelIntegration } from "../../src/integrations/vercel.js";
import { zendeskIntegration } from "../../src/integrations/zendesk.js";
import { genericOAuthIntegration, createSimpleIntegration } from "../../src/integrations/generic.js";
import { hasOAuthConfig } from "../../src/integrations/types.js";

describe("Integration System", () => {
  describe("GitHub Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = githubIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("github");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = githubIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["repo", "user", "admin:org"],
      });

      expect(integration.oauth?.provider).toBe("github");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["repo", "user", "admin:org"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = githubIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toEqual(["repo", "user"]);
    });

    test("includes expected tools", () => {
      const integration = githubIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("github_create_issue");
      expect(integration.tools).toContain("github_list_repos");
      expect(integration.tools).toContain("github_create_pull_request");
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

      // Test onInit
      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();

      // Test onAfterConnect
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Gmail Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gmailIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gmail");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gmailIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gmail");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("includes expected tools", () => {
      const integration = gmailIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gmail_send_message");
      expect(integration.tools).toContain("gmail_list_messages");
      expect(integration.tools).toContain("gmail_search_messages");
      expect(integration.tools).toContain("gmail_get_message");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gmailIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gmailIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      // Test onInit
      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();

      // Test onAfterConnect
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Notion Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = notionIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("notion");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
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

    test("includes expected tools", () => {
      const integration = notionIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("notion_search");
      expect(integration.tools).toContain("notion_get_page");
    });

    test("uses default owner parameter", () => {
      const integration = notionIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.config).toBeDefined();
      expect((integration.oauth?.config as any).owner).toBe("user");
    });

    test("allows custom owner parameter", () => {
      const integration = notionIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        owner: "workspace",
      });

      expect(integration.oauth?.config).toBeDefined();
      expect((integration.oauth?.config as any).owner).toBe("workspace");
    });

    test("includes custom authorization endpoint", () => {
      const integration = notionIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.config).toBeDefined();
      expect((integration.oauth?.config as any).authorization_endpoint).toBe("https://api.notion.com/v1/oauth/authorize");
      expect((integration.oauth?.config as any).token_endpoint).toBe("https://api.notion.com/v1/oauth/token");
    });

    test("does not use traditional OAuth scopes", () => {
      const integration = notionIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toEqual([]);
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

      // Test onInit
      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();

      // Test onAfterConnect
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Slack Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = slackIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("slack");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["chat:write", "channels:read"],
      });

      expect(integration.oauth?.provider).toBe("slack");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["chat:write", "channels:read"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("chat:write");
      expect(integration.oauth?.scopes).toContain("channels:read");
    });

    test("includes expected tools", () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("slack_send_message");
      expect(integration.tools).toContain("slack_list_channels");
      expect(integration.tools).toContain("slack_search_messages");
    });

    test("has lifecycle hooks defined", () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Linear Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = linearIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("linear");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["read", "write"],
      });

      expect(integration.oauth?.provider).toBe("linear");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["read", "write"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("read");
      expect(integration.oauth?.scopes).toContain("write");
    });

    test("includes expected tools", () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("linear_create_issue");
      expect(integration.tools).toContain("linear_list_issues");
      expect(integration.tools).toContain("linear_search_issues");
    });

    test("has lifecycle hooks defined", () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Vercel Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = vercelIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("vercel");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = vercelIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("vercel");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("includes expected tools", () => {
      const integration = vercelIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("vercel_list_projects");
      expect(integration.tools).toContain("vercel_list_deployments");
      expect(integration.tools).toContain("vercel_create_deployment");
    });

    test("has lifecycle hooks defined", () => {
      const integration = vercelIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = vercelIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Zendesk Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = zendeskIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("zendesk");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["read", "write"],
      });

      expect(integration.oauth?.provider).toBe("zendesk");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["read", "write"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("read");
      expect(integration.oauth?.scopes).toContain("write");
    });

    test("includes expected tools", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("zendesk_list_tickets");
      expect(integration.tools).toContain("zendesk_create_ticket");
      expect(integration.tools).toContain("zendesk_search_tickets");
    });

    test("supports subdomain configuration", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        subdomain: "mycompany",
      });

      expect(integration.oauth?.config).toBeDefined();
      expect((integration.oauth?.config as any).subdomain).toBe("mycompany");
    });

    test("has lifecycle hooks defined", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Generic OAuth Integration", () => {
    test("creates integration for server-supported integration", () => {
      const integration = genericOAuthIntegration({
        id: "slack",
        provider: "slack",
        clientId: "slack-id",
        clientSecret: "slack-secret",
        scopes: ["chat:write", "channels:read"],
        tools: ["slack/sendMessage", "slack/listChannels"],
      });

      expect(integration.id).toBe("slack");
      expect(integration.oauth?.provider).toBe("slack");
      expect(integration.tools).toEqual(["slack/sendMessage", "slack/listChannels"]);
    });

    test("supports additional configuration", () => {
      const additionalConfig = {
        customField: "value",
        apiUrl: "https://api.example.com",
      };

      const integration = genericOAuthIntegration({
        id: "custom",
        provider: "custom-provider",
        clientId: "id",
        clientSecret: "secret",
        scopes: ["read"],
        tools: ["custom/tool"],
        config: additionalConfig,
      });

      // The entire config is stored in the OAuth config
      expect(integration.oauth?.config).toEqual({
        id: "custom",
        provider: "custom-provider",
        clientId: "id",
        clientSecret: "secret",
        scopes: ["read"],
        tools: ["custom/tool"],
        config: additionalConfig,
      });
    });
  });

  describe("Simple Integration", () => {
    test("creates integration without OAuth", () => {
      const integration = createSimpleIntegration({
        id: "math",
        tools: ["math/add", "math/subtract"],
      });

      expect(integration.id).toBe("math");
      expect(integration.tools).toEqual(["math/add", "math/subtract"]);
      expect(integration.oauth).toBeUndefined();
    });

    test("supports lifecycle hooks", () => {
      let initCalled = false;
      let connectCalled = false;

      const integration = createSimpleIntegration({
        id: "test",
        tools: ["test/tool"],
        onInit: () => {
          initCalled = true;
        },
        onAfterConnect: () => {
          connectCalled = true;
        },
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();

      integration.onInit?.(null as any);
      integration.onAfterConnect?.(null as any);

      expect(initCalled).toBe(true);
      expect(connectCalled).toBe(true);
    });
  });

  describe("hasOAuthConfig type guard", () => {
    test("returns true for integration with OAuth", () => {
      const integration = githubIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(hasOAuthConfig(integration)).toBe(true);
    });

    test("returns false for integration without OAuth", () => {
      const integration = createSimpleIntegration({
        id: "test",
        tools: ["test/tool"],
      });

      expect(hasOAuthConfig(integration)).toBe(false);
    });
  });
});

