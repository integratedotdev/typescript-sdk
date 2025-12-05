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
import { stripeIntegration } from "../../src/integrations/stripe.js";
import { gcalIntegration } from "../../src/integrations/gcal.js";
import { outlookIntegration } from "../../src/integrations/outlook.js";
import { airtableIntegration } from "../../src/integrations/airtable.js";
import { todoistIntegration } from "../../src/integrations/todoist.js";
import { whatsappIntegration } from "../../src/integrations/whatsapp.js";
import { calcomIntegration } from "../../src/integrations/calcom.js";
import { rampIntegration } from "../../src/integrations/ramp.js";
import { onedriveIntegration } from "../../src/integrations/onedrive.js";
import { gworkspaceIntegration } from "../../src/integrations/gworkspace.js";
import { polarIntegration } from "../../src/integrations/polar.js";
import { figmaIntegration } from "../../src/integrations/figma.js";
import { intercomIntegration } from "../../src/integrations/intercom.js";
import { hubspotIntegration } from "../../src/integrations/hubspot.js";
import { youtubeIntegration } from "../../src/integrations/youtube.js";
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

  describe("Stripe Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = stripeIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("stripe");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = stripeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["read_write"],
      });

      expect(integration.oauth?.provider).toBe("stripe");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["read_write"]);
    });

    test("includes expected tools", () => {
      const integration = stripeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("stripe_list_customers");
      expect(integration.tools).toContain("stripe_create_payment");
      expect(integration.tools).toContain("stripe_list_subscriptions");
    });

    test("has lifecycle hooks defined", () => {
      const integration = stripeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = stripeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Calendar Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gcalIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gcal");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gcal");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("uses default scopes when not provided", () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/calendar");
    });

    test("includes expected tools", () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gcal_list_calendars");
      expect(integration.tools).toContain("gcal_create_event");
      expect(integration.tools).toContain("gcal_quick_add");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Outlook Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = outlookIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("outlook");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("outlook");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("uses default scopes when not provided", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("Mail.Read");
      expect(integration.oauth?.scopes).toContain("Mail.Send");
    });

    test("includes expected tools", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("outlook_list_messages");
      expect(integration.tools).toContain("outlook_send_message");
      expect(integration.tools).toContain("outlook_search");
    });

    test("has lifecycle hooks defined", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Airtable Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = airtableIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("airtable");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("airtable");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("uses default scopes when not provided", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("data.records:read");
      expect(integration.oauth?.scopes).toContain("data.records:write");
    });

    test("includes expected tools", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("airtable_list_bases");
      expect(integration.tools).toContain("airtable_create_record");
      expect(integration.tools).toContain("airtable_search_records");
    });

    test("has lifecycle hooks defined", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Todoist Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = todoistIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("todoist");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
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

    test("uses default scopes when not provided", () => {
      const integration = todoistIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("data:read_write");
    });

    test("includes expected tools", () => {
      const integration = todoistIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("todoist_list_projects");
      expect(integration.tools).toContain("todoist_create_task");
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
  });

  describe("WhatsApp Business Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = whatsappIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("whatsapp");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["business_management", "whatsapp_business_messaging"],
      });

      expect(integration.oauth?.provider).toBe("whatsapp");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["business_management", "whatsapp_business_messaging"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("business_management");
      expect(integration.oauth?.scopes).toContain("whatsapp_business_messaging");
    });

    test("includes expected tools", () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("whatsapp_send_message");
      expect(integration.tools).toContain("whatsapp_send_template");
      expect(integration.tools).toContain("whatsapp_send_media");
      expect(integration.tools).toContain("whatsapp_list_templates");
      expect(integration.tools).toContain("whatsapp_get_phone_numbers");
      expect(integration.tools).toContain("whatsapp_get_message_status");
      expect(integration.tools).toContain("whatsapp_mark_read");
      expect(integration.tools).toContain("whatsapp_get_profile");
    });

    test("has lifecycle hooks defined", () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Cal.com Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = calcomIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("calcom");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["read:bookings", "write:bookings"],
      });

      expect(integration.oauth?.provider).toBe("calcom");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["read:bookings", "write:bookings"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("read:bookings");
      expect(integration.oauth?.scopes).toContain("write:bookings");
      expect(integration.oauth?.scopes).toContain("read:event-types");
      expect(integration.oauth?.scopes).toContain("read:schedules");
    });

    test("includes expected tools", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("calcom_list_bookings");
      expect(integration.tools).toContain("calcom_get_booking");
      expect(integration.tools).toContain("calcom_create_booking");
      expect(integration.tools).toContain("calcom_cancel_booking");
      expect(integration.tools).toContain("calcom_reschedule_booking");
      expect(integration.tools).toContain("calcom_list_event_types");
      expect(integration.tools).toContain("calcom_get_availability");
      expect(integration.tools).toContain("calcom_list_schedules");
      expect(integration.tools).toContain("calcom_get_me");
    });

    test("has lifecycle hooks defined", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Ramp Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = rampIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("ramp");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["transactions:read", "cards:read"],
      });

      expect(integration.oauth?.provider).toBe("ramp");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["transactions:read", "cards:read"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("transactions:read");
      expect(integration.oauth?.scopes).toContain("cards:read");
      expect(integration.oauth?.scopes).toContain("users:read");
    });

    test("includes expected tools", () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("ramp_list_transactions");
      expect(integration.tools).toContain("ramp_get_transaction");
      expect(integration.tools).toContain("ramp_list_cards");
      expect(integration.tools).toContain("ramp_get_card");
      expect(integration.tools).toContain("ramp_list_users");
      expect(integration.tools).toContain("ramp_get_user");
      expect(integration.tools).toContain("ramp_list_departments");
      expect(integration.tools).toContain("ramp_list_reimbursements");
      expect(integration.tools).toContain("ramp_get_spend_limits");
    });

    test("has lifecycle hooks defined", () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("OneDrive Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = onedriveIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("onedrive");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["Files.Read", "Files.ReadWrite"],
      });

      expect(integration.oauth?.provider).toBe("onedrive");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["Files.Read", "Files.ReadWrite"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("Files.Read");
      expect(integration.oauth?.scopes).toContain("Files.ReadWrite");
      expect(integration.oauth?.scopes).toContain("offline_access");
    });

    test("includes expected tools", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("onedrive_list_files");
      expect(integration.tools).toContain("onedrive_get_file");
      expect(integration.tools).toContain("onedrive_upload_file");
      expect(integration.tools).toContain("onedrive_excel_get_worksheets");
      expect(integration.tools).toContain("onedrive_word_get_content");
      expect(integration.tools).toContain("onedrive_powerpoint_get_slides");
    });

    test("has lifecycle hooks defined", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Workspace Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gworkspaceIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gworkspace");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gworkspaceIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      expect(integration.oauth?.provider).toBe("gworkspace");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["https://www.googleapis.com/auth/spreadsheets"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = gworkspaceIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/spreadsheets");
      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/documents");
      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/presentations");
      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/drive.readonly");
    });

    test("includes expected tools", () => {
      const integration = gworkspaceIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gworkspace_sheets_list");
      expect(integration.tools).toContain("gworkspace_sheets_get_values");
      expect(integration.tools).toContain("gworkspace_docs_list");
      expect(integration.tools).toContain("gworkspace_docs_create");
      expect(integration.tools).toContain("gworkspace_slides_list");
      expect(integration.tools).toContain("gworkspace_slides_get_page");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gworkspaceIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gworkspaceIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Polar Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = polarIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("polar");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["products:read", "subscriptions:read"],
      });

      expect(integration.oauth?.provider).toBe("polar");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["products:read", "subscriptions:read"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("products:read");
      expect(integration.oauth?.scopes).toContain("subscriptions:read");
      expect(integration.oauth?.scopes).toContain("customers:read");
      expect(integration.oauth?.scopes).toContain("orders:read");
      expect(integration.oauth?.scopes).toContain("benefits:read");
    });

    test("includes expected tools", () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("polar_list_products");
      expect(integration.tools).toContain("polar_get_product");
      expect(integration.tools).toContain("polar_list_subscriptions");
      expect(integration.tools).toContain("polar_get_subscription");
      expect(integration.tools).toContain("polar_list_customers");
      expect(integration.tools).toContain("polar_list_orders");
      expect(integration.tools).toContain("polar_list_benefits");
    });

    test("has lifecycle hooks defined", () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Figma Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = figmaIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("figma");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["files:read"],
      });

      expect(integration.oauth?.provider).toBe("figma");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["files:read"]);
    });

    test("uses default scopes when not provided", () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("files:read");
      expect(integration.oauth?.scopes).toContain("file_comments:write");
    });

    test("includes expected tools", () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("figma_get_file");
      expect(integration.tools).toContain("figma_get_file_nodes");
      expect(integration.tools).toContain("figma_get_images");
      expect(integration.tools).toContain("figma_post_comment");
      expect(integration.tools).toContain("figma_list_projects");
      expect(integration.tools).toContain("figma_get_team_components");
    });

    test("has lifecycle hooks defined", () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Intercom Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = intercomIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("intercom");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("intercom");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("uses empty scopes by default (app-level permissions)", () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toEqual([]);
    });

    test("includes expected tools", () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("intercom_list_contacts");
      expect(integration.tools).toContain("intercom_get_contact");
      expect(integration.tools).toContain("intercom_create_contact");
      expect(integration.tools).toContain("intercom_list_conversations");
      expect(integration.tools).toContain("intercom_reply_conversation");
      expect(integration.tools).toContain("intercom_search_contacts");
    });

    test("has lifecycle hooks defined", () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("HubSpot Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = hubspotIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("hubspot");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["crm.objects.contacts.read"],
      });

      expect(integration.oauth?.provider).toBe("hubspot");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["crm.objects.contacts.read"]);
    });

    test("uses default CRM scopes when not provided", () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("crm.objects.contacts.read");
      expect(integration.oauth?.scopes).toContain("crm.objects.contacts.write");
      expect(integration.oauth?.scopes).toContain("crm.objects.companies.read");
      expect(integration.oauth?.scopes).toContain("crm.objects.deals.read");
      expect(integration.oauth?.scopes).toContain("tickets");
    });

    test("includes expected tools", () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("hubspot_list_contacts");
      expect(integration.tools).toContain("hubspot_create_contact");
      expect(integration.tools).toContain("hubspot_list_companies");
      expect(integration.tools).toContain("hubspot_create_company");
      expect(integration.tools).toContain("hubspot_list_deals");
      expect(integration.tools).toContain("hubspot_create_deal");
      expect(integration.tools).toContain("hubspot_list_tickets");
    });

    test("has lifecycle hooks defined", () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("YouTube Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = youtubeIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("youtube");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = youtubeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
      });

      expect(integration.oauth?.provider).toBe("youtube");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["https://www.googleapis.com/auth/youtube.readonly"]);
    });

    test("uses default YouTube readonly scope when not provided", () => {
      const integration = youtubeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("https://www.googleapis.com/auth/youtube.readonly");
    });

    test("includes expected tools", () => {
      const integration = youtubeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("youtube_search");
      expect(integration.tools).toContain("youtube_get_video");
      expect(integration.tools).toContain("youtube_list_playlists");
      expect(integration.tools).toContain("youtube_get_playlist");
      expect(integration.tools).toContain("youtube_list_playlist_items");
      expect(integration.tools).toContain("youtube_get_channel");
      expect(integration.tools).toContain("youtube_list_subscriptions");
      expect(integration.tools).toContain("youtube_list_comments");
      expect(integration.tools).toContain("youtube_get_captions");
    });

    test("has lifecycle hooks defined", () => {
      const integration = youtubeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = youtubeIntegration({
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

