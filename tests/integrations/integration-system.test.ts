/**
 * Integration System Tests
 */

import { describe, test, expect } from "bun:test";
import { githubIntegration } from "../../src/integrations/github.js";
import { gmailIntegration } from "../../src/integrations/gmail.js";
import { notionIntegration } from "../../src/integrations/notion.js";
import { slackIntegration } from "../../src/integrations/slack.js";
import { linearIntegration } from "../../src/integrations/linear.js";
import { railwayIntegration } from "../../src/integrations/railway.js";
import { vercelIntegration } from "../../src/integrations/vercel.js";
import { zendeskIntegration } from "../../src/integrations/zendesk.js";
import { stripeIntegration } from "../../src/integrations/stripe.js";
import { gcalIntegration } from "../../src/integrations/gcal.js";
import { gcontactsIntegration } from "../../src/integrations/gcontacts.js";
import { gtasksIntegration } from "../../src/integrations/gtasks.js";
import { gmeetIntegration } from "../../src/integrations/gmeet.js";
import { outlookIntegration } from "../../src/integrations/outlook.js";
import { teamsIntegration } from "../../src/integrations/teams.js";
import { airtableIntegration } from "../../src/integrations/airtable.js";
import { alpacaIntegration } from "../../src/integrations/alpaca.js";
import { auth0Integration } from "../../src/integrations/auth0.js";
import { todoistIntegration } from "../../src/integrations/todoist.js";
import { whatsappIntegration } from "../../src/integrations/whatsapp.js";
import { calcomIntegration } from "../../src/integrations/calcom.js";
import { canvaIntegration } from "../../src/integrations/canva.js";
import { rampIntegration } from "../../src/integrations/ramp.js";
import { onedriveIntegration } from "../../src/integrations/onedrive.js";
import { dropboxIntegration } from "../../src/integrations/dropbox.js";
import { paperIntegration } from "../../src/integrations/paper.js";
import { gdocsIntegration } from "../../src/integrations/gdocs.js";
import { gsheetsIntegration } from "../../src/integrations/gsheets.js";
import { gslidesIntegration } from "../../src/integrations/gslides.js";
import { polarIntegration } from "../../src/integrations/polar.js";
import { planetscaleIntegration } from "../../src/integrations/planetscale.js";
import { supabaseIntegration } from "../../src/integrations/supabase.js";
import { facebookIntegration } from "../../src/integrations/facebook.js";
import { figmaIntegration } from "../../src/integrations/figma.js";
import { intercomIntegration } from "../../src/integrations/intercom.js";
import { hubspotIntegration } from "../../src/integrations/hubspot.js";
import { instagramIntegration } from "../../src/integrations/instagram.js";
import { youtubeIntegration } from "../../src/integrations/youtube.js";
import { cursorIntegration } from "../../src/integrations/cursor.js";
import { databricksIntegration } from "../../src/integrations/databricks.js";
import { posthogIntegration } from "../../src/integrations/posthog.js";
import { sentryIntegration } from "../../src/integrations/sentry.js";
import { datadogIntegration } from "../../src/integrations/datadog.js";
import { netlifyIntegration } from "../../src/integrations/netlify.js";
import { jiraIntegration } from "../../src/integrations/jira.js";
import { clickupIntegration } from "../../src/integrations/clickup.js";
import { tiktokIntegration } from "../../src/integrations/tiktok.js";
import { threadsIntegration } from "../../src/integrations/threads.js";
import { resendIntegration } from "../../src/integrations/resend.js";
import { wixIntegration } from "../../src/integrations/wix.js";
import { redisIntegration } from "../../src/integrations/redis.js";
import { granolaIntegration } from "../../src/integrations/granola.js";
import { mercuryIntegration } from "../../src/integrations/mercury.js";
import { awsIntegration } from "../../src/integrations/aws.js";
import { betterstackIntegration } from "../../src/integrations/betterstack.js";
import { mondayIntegration } from "../../src/integrations/monday.js";
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = githubIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

  describe("Granola Integration", () => {
    test("creates Granola integration with apiKey", () => {
      const integration = granolaIntegration({
        apiKey: "gr_test_key",
      });

      expect(integration.id).toBe("granola");
      expect(integration.authType).toBe("apiKey");
      expect(integration.tools).toEqual([
        "granola_list_notes",
        "granola_get_note",
        "granola_list_folders",
      ]);
    });

    test("throws when apiKey is missing", () => {
      expect(() => granolaIntegration({
        apiKey: "",
      })).toThrow("granolaIntegration requires an apiKey");
    });

    test("sends Authorization bearer header", () => {
      const integration = granolaIntegration({
        apiKey: "gr_test_key",
      });

      expect(integration.getHeaders?.()).toEqual({
        Authorization: "Bearer gr_test_key",
      });
    });
  });

  describe("Mercury Integration", () => {
    test("requires apiKey", () => {
      expect(() =>
        mercuryIntegration({
          apiKey: "",
        })
      ).toThrow("mercuryIntegration requires an apiKey");
    });

    test("sends Authorization bearer header", () => {
      const integration = mercuryIntegration({
        apiKey: "secret-token:mercury_test",
      });

      expect(integration.getHeaders?.()).toEqual({
        Authorization: "Bearer secret-token:mercury_test",
      });
    });

    test("registers provider name mercury", () => {
      const integration = mercuryIntegration({
        apiKey: "secret-token:mercury_test",
      });

      expect(integration.id).toBe("mercury");
      expect(integration.name).toBe("Mercury");
      expect(integration.authType).toBe("apiKey");
    });

    test("includes expected tools", () => {
      const integration = mercuryIntegration({
        apiKey: "secret-token:mercury_test",
      });

      expect(integration.tools).toContain("mercury_get_organization");
      expect(integration.tools).toContain("mercury_list_accounts");
      expect(integration.tools).toContain("mercury_list_transactions");
      expect(integration.tools).toContain("mercury_list_cards");
      expect(integration.tools).toContain("mercury_list_recipients");
      expect(integration.tools).toContain("mercury_create_internal_transfer");
    });
  });

  describe("AWS Integration", () => {
    test("requires credentials or env", () => {
      const prevId = process.env.AWS_ACCESS_KEY_ID;
      const prevSecret = process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      try {
        expect(() => awsIntegration()).toThrow();
      } finally {
        if (prevId === undefined) delete process.env.AWS_ACCESS_KEY_ID;
        else process.env.AWS_ACCESS_KEY_ID = prevId;
        if (prevSecret === undefined) delete process.env.AWS_SECRET_ACCESS_KEY;
        else process.env.AWS_SECRET_ACCESS_KEY = prevSecret;
      }
    });

    test("registers provider id aws", () => {
      const integration = awsIntegration({
        credentials: { accessKeyId: "A", secretAccessKey: "B" },
      });
      expect(integration.id).toBe("aws");
      expect(integration.authType).toBe("apiKey");
    });

    test("includes expected tools", () => {
      const integration = awsIntegration({
        credentials: { accessKeyId: "A", secretAccessKey: "B" },
      });
      expect(integration.tools).toContain("aws_sts_get_caller_identity");
      expect(integration.tools).toContain("aws_lambda_list_functions");
    });
  });

  describe("Monday.com Integration", () => {
    test("registers provider monday", () => {
      const integration = mondayIntegration({
        clientId: "cid",
        clientSecret: "sec",
      });
      expect(integration.id).toBe("monday");
      expect(integration.oauth?.provider).toBe("monday");
    });

    test("includes GraphQL tool names", () => {
      const integration = mondayIntegration({
        clientId: "cid",
        clientSecret: "sec",
      });
      expect(integration.tools).toContain("monday_me");
      expect(integration.tools).toContain("monday_list_board_items");
      expect(integration.tools).toContain("monday_next_items_page");
    });
  });

  describe("Auth0 Integration", () => {
    test("uses apiKey auth with tenant header", () => {
      const integration = auth0Integration({
        domain: "dev-x.us.auth0.com",
        accessToken: "mgmt",
      });
      expect(integration.id).toBe("auth0");
      expect(integration.authType).toBe("apiKey");
      expect(integration.getHeaders?.()).toEqual({
        Authorization: "Bearer mgmt",
        "X-Auth0-Domain": "dev-x.us.auth0.com",
      });
    });

    test("includes management tools", () => {
      const integration = auth0Integration({
        domain: "dev.us.auth0.com",
        accessToken: "t",
      });
      expect(integration.tools).toContain("auth0_list_clients");
      expect(integration.tools).toContain("auth0_patch_user");
    });
  });

  describe("Better Stack Integration", () => {
    test("requires apiKey or env", () => {
      expect(() => betterstackIntegration()).toThrow();
    });

    test("sends Telemetry API token as bearer", () => {
      const integration = betterstackIntegration({
        apiKey: "bs_telemetry_token",
      });

      expect(integration.getHeaders?.()).toEqual({
        Authorization: "Bearer bs_telemetry_token",
      });
      expect(integration.id).toBe("betterstack");
      expect(integration.authType).toBe("apiKey");
    });

    test("includes expected tools", () => {
      const integration = betterstackIntegration({ apiKey: "k" });

      expect(integration.tools).toContain("betterstack_list_sources");
      expect(integration.tools).toContain("betterstack_ingest_logs");
    });
  });

  describe("Alpaca Integration", () => {
    test("requires API keys", () => {
      expect(() =>
        alpacaIntegration({
          apiKeyId: "",
          apiSecretKey: "sec",
        })
      ).toThrow();
      expect(() =>
        alpacaIntegration({
          apiKeyId: "pk",
          apiSecretKey: "",
        })
      ).toThrow();
    });

    test("sends Alpaca auth headers", () => {
      const integration = alpacaIntegration({
        apiKeyId: "PKTEST",
        apiSecretKey: "SKTEST",
      });

      expect(integration.getHeaders?.()).toEqual({
        "APCA-API-KEY-ID": "PKTEST",
        "APCA-API-SECRET-KEY": "SKTEST",
      });
    });

    test("sends live environment header", () => {
      const integration = alpacaIntegration({
        apiKeyId: "PK",
        apiSecretKey: "SK",
        environment: "live",
      });

      expect(integration.getHeaders?.()).toEqual({
        "APCA-API-KEY-ID": "PK",
        "APCA-API-SECRET-KEY": "SK",
        "X-Integrate-Alpaca-Environment": "live",
      });
    });

    test("registers provider id alpaca", () => {
      const integration = alpacaIntegration({
        apiKeyId: "PK",
        apiSecretKey: "SK",
      });

      expect(integration.id).toBe("alpaca");
      expect(integration.name).toBe("Alpaca");
      expect(integration.authType).toBe("apiKey");
    });

    test("includes expected tools", () => {
      const integration = alpacaIntegration({
        apiKeyId: "PK",
        apiSecretKey: "SK",
      });

      expect(integration.tools).toContain("alpaca_get_account");
      expect(integration.tools).toContain("alpaca_create_order");
      expect(integration.tools).toContain("alpaca_list_orders");
      expect(integration.tools).toContain("alpaca_get_clock");
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

  describe("PostHog Integration", () => {
    test("creates integration with default PostHog OAuth configuration", () => {
      const integration = posthogIntegration({
        clientId: "posthog-client-id",
        clientSecret: "posthog-client-secret",
      });

      expect(integration.id).toBe("posthog");
      expect(integration.name).toBe("PostHog");
      expect(integration.category).toBe("Analytics");
      expect(integration.oauth?.provider).toBe("posthog");
      expect(integration.oauth?.scopes).toContain("query:read");
      expect((integration.oauth?.config as any).baseUrl).toBe("https://us.posthog.com");
      expect((integration.oauth?.config as any).authorization_endpoint).toBe("https://us.posthog.com/oauth/authorize/");
      expect((integration.oauth?.config as any).token_endpoint).toBe("https://us.posthog.com/oauth/token/");
      expect(integration.tools).toContain("posthog_run_hogql_query");
      expect(integration.tools).toContain("posthog_get_session_recording");
    });

    test("normalizes custom PostHog hosts for EU or self-hosted deployments", () => {
      const integration = posthogIntegration({
        clientId: "posthog-client-id",
        clientSecret: "posthog-client-secret",
        baseUrl: "eu.posthog.com/",
      });

      expect((integration.oauth?.config as any).baseUrl).toBe("https://eu.posthog.com");
      expect((integration.oauth?.config as any).authorization_endpoint).toBe("https://eu.posthog.com/oauth/authorize/");
      expect((integration.oauth?.config as any).token_endpoint).toBe("https://eu.posthog.com/oauth/token/");
    });
  });

  describe("Railway Integration", () => {
    test("creates integration with default Railway OAuth configuration", () => {
      const integration = railwayIntegration({
        clientId: "railway-client-id",
        clientSecret: "railway-client-secret",
      });

      expect(integration.id).toBe("railway");
      expect(integration.name).toBe("Railway");
      expect(integration.category).toBe("Infrastructure");
      expect(integration.oauth?.provider).toBe("railway");
      expect(integration.oauth?.scopes).toEqual([
        "openid",
        "profile",
        "email",
        "workspace:admin",
        "project:member",
      ]);
      expect((integration.oauth?.config as any).authorization_endpoint).toBe(
        "https://backboard.railway.com/oauth/auth"
      );
      expect((integration.oauth?.config as any).token_endpoint).toBe(
        "https://backboard.railway.com/oauth/token"
      );
      expect((integration.oauth?.config as any).apiBaseUrl).toBe(
        "https://backboard.railway.com/graphql/v2"
      );
      expect(integration.tools).toContain("railway_get_current_user");
      expect(integration.tools).toContain("railway_create_project");
      expect(integration.tools).toContain("railway_list_tcp_proxies");
      expect(integration.tools).toHaveLength(68);
    });

    test("allows overriding Railway scopes", () => {
      const integration = railwayIntegration({
        clientId: "railway-client-id",
        clientSecret: "railway-client-secret",
        scopes: ["openid", "workspace:admin"],
      });

      expect(integration.oauth?.scopes).toEqual(["openid", "workspace:admin"]);
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

      // Search
      expect(integration.tools).toContain("notion_search");
      // Pages
      expect(integration.tools).toContain("notion_get_page");
      expect(integration.tools).toContain("notion_create_page");
      expect(integration.tools).toContain("notion_update_page");
      expect(integration.tools).toContain("notion_get_page_property");
      // Databases
      expect(integration.tools).toContain("notion_get_database");
      expect(integration.tools).toContain("notion_query_database");
      expect(integration.tools).toContain("notion_create_database");
      expect(integration.tools).toContain("notion_update_database");
      // Blocks
      expect(integration.tools).toContain("notion_get_block");
      expect(integration.tools).toContain("notion_get_block_children");
      expect(integration.tools).toContain("notion_append_blocks");
      expect(integration.tools).toContain("notion_update_block");
      expect(integration.tools).toContain("notion_delete_block");
      // Users
      expect(integration.tools).toContain("notion_get_user");
      expect(integration.tools).toContain("notion_get_current_user");
      expect(integration.tools).toContain("notion_list_users");
      // Comments
      expect(integration.tools).toContain("notion_create_comment");
      expect(integration.tools).toContain("notion_list_comments");
      // Page Move
      expect(integration.tools).toContain("notion_move_page");
      // File Uploads
      expect(integration.tools).toContain("notion_create_file_upload");
      expect(integration.tools).toContain("notion_send_file_upload");
      expect(integration.tools).toContain("notion_complete_file_upload");
      expect(integration.tools).toContain("notion_get_file_upload");
      // Data Sources
      expect(integration.tools).toContain("notion_create_data_source");
      expect(integration.tools).toContain("notion_get_data_source");
      expect(integration.tools).toContain("notion_update_data_source");
      expect(integration.tools).toContain("notion_query_data_source");

      expect(integration.tools).toHaveLength(28);
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

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = slackIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = linearIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = zendeskIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("zendesk_list_tickets");
      expect(integration.tools).toContain("zendesk_create_ticket");
      expect(integration.tools).toContain("zendesk_search_tickets");
      expect(integration.tools).toContain("zendesk_delete_ticket");
      expect(integration.tools).toContain("zendesk_list_ticket_comments");
      expect(integration.tools).toContain("zendesk_list_groups");
      expect(integration.tools).toContain("zendesk_search");
      expect(integration.tools).toContain("zendesk_list_views");
      expect(integration.tools).toContain("zendesk_add_tags");
      expect(integration.tools).toContain("zendesk_remove_tags");
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gcalIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

  describe("Google Contacts Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gcontactsIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gcontacts");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.logoUrl).toBeDefined();
      expect(integration.description).toBeDefined();
      expect(integration.category).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gcontactsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gcontacts");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gcontactsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = gcontactsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gcontacts_list_connections");
      expect(integration.tools).toContain("gcontacts_create_contact");
      expect(integration.tools).toContain("gcontacts_search_contacts");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gcontactsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gcontactsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Tasks Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gtasksIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gtasks");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gtasksIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gtasks");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gtasksIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = gtasksIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gtasks_list_tasklists");
      expect(integration.tools).toContain("gtasks_create_task");
      expect(integration.tools).toContain("gtasks_clear_completed");
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gtasksIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Meet Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gmeetIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gmeet");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gmeetIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gmeet");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("includes expected tools", () => {
      const integration = gmeetIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gmeet_create_meeting");
      expect(integration.tools).toContain("gmeet_list_meetings");
      expect(integration.tools).toContain("gmeet_add_meet_to_event");
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gmeetIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = outlookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("outlook_list_messages");
      expect(integration.tools).toContain("outlook_send_message");
      expect(integration.tools).toContain("outlook_search_messages");
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

  describe("Microsoft Teams Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = teamsIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("teams");
      expect(integration.name).toBe("Microsoft Teams");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.logoUrl).toBeDefined();
      expect(integration.description).toBeDefined();
      expect(integration.category).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = teamsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("teams");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("uses default scopes when none provided", () => {
      const integration = teamsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeArray();
      expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    });

    test("accepts custom scopes", () => {
      const integration = teamsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["User.Read"],
      });

      expect(integration.oauth?.scopes).toEqual(["User.Read"]);
    });

    test("includes expected tools", () => {
      const integration = teamsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("teams_list_teams");
      expect(integration.tools).toContain("teams_send_channel_message");
      expect(integration.tools).toContain("teams_get_profile");
    });

    test("has lifecycle hooks defined", () => {
      const integration = teamsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = teamsIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = airtableIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      // Existing tools
      expect(integration.tools).toContain("airtable_list_bases");
      expect(integration.tools).toContain("airtable_get_base");
      expect(integration.tools).toContain("airtable_list_tables");
      expect(integration.tools).toContain("airtable_get_table");
      expect(integration.tools).toContain("airtable_list_records");
      expect(integration.tools).toContain("airtable_get_record");
      expect(integration.tools).toContain("airtable_create_record");
      expect(integration.tools).toContain("airtable_update_record");
      expect(integration.tools).toContain("airtable_search_records");
      // Records
      expect(integration.tools).toContain("airtable_delete_record");
      // Schema Management
      expect(integration.tools).toContain("airtable_create_base");
      expect(integration.tools).toContain("airtable_create_table");
      expect(integration.tools).toContain("airtable_update_table");
      expect(integration.tools).toContain("airtable_create_field");
      expect(integration.tools).toContain("airtable_update_field");
      // Comments
      expect(integration.tools).toContain("airtable_list_comments");
      expect(integration.tools).toContain("airtable_create_comment");
      expect(integration.tools).toContain("airtable_update_comment");
      expect(integration.tools).toContain("airtable_delete_comment");
      // Webhooks
      expect(integration.tools).toContain("airtable_list_webhooks");
      expect(integration.tools).toContain("airtable_create_webhook");
      expect(integration.tools).toContain("airtable_delete_webhook");
      expect(integration.tools).toContain("airtable_list_webhook_payloads");
      expect(integration.tools).toContain("airtable_refresh_webhook");
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = todoistIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = whatsappIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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
      expect(integration.tools).toContain("whatsapp_create_qr_code");
      expect(integration.tools).toContain("whatsapp_update_qr_code");
      expect(integration.tools).toContain("whatsapp_list_qr_codes");
      expect(integration.tools).toContain("whatsapp_get_qr_code");
      expect(integration.tools).toContain("whatsapp_delete_qr_code");
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = calcomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      // Bookings
      expect(integration.tools).toContain("calcom_list_bookings");
      expect(integration.tools).toContain("calcom_get_booking");
      expect(integration.tools).toContain("calcom_create_booking");
      expect(integration.tools).toContain("calcom_cancel_booking");
      expect(integration.tools).toContain("calcom_reschedule_booking");
      expect(integration.tools).toContain("calcom_update_booking");
      expect(integration.tools).toContain("calcom_get_booking_recordings");
      expect(integration.tools).toContain("calcom_get_booking_transcripts");
      // Event Types
      expect(integration.tools).toContain("calcom_list_event_types");
      expect(integration.tools).toContain("calcom_get_event_type");
      expect(integration.tools).toContain("calcom_create_event_type");
      expect(integration.tools).toContain("calcom_update_event_type");
      expect(integration.tools).toContain("calcom_delete_event_type");
      expect(integration.tools).toContain("calcom_list_team_event_types");
      // Availability
      expect(integration.tools).toContain("calcom_get_availability");
      expect(integration.tools).toContain("calcom_get_availability_rule");
      expect(integration.tools).toContain("calcom_create_availability_rule");
      expect(integration.tools).toContain("calcom_update_availability_rule");
      expect(integration.tools).toContain("calcom_delete_availability_rule");
      // Schedules
      expect(integration.tools).toContain("calcom_list_schedules");
      expect(integration.tools).toContain("calcom_get_schedule");
      expect(integration.tools).toContain("calcom_create_schedule");
      expect(integration.tools).toContain("calcom_update_schedule");
      expect(integration.tools).toContain("calcom_delete_schedule");
      // Slots
      expect(integration.tools).toContain("calcom_get_slots");
      // Attendees
      expect(integration.tools).toContain("calcom_list_attendees");
      expect(integration.tools).toContain("calcom_get_attendee");
      expect(integration.tools).toContain("calcom_create_attendee");
      expect(integration.tools).toContain("calcom_update_attendee");
      expect(integration.tools).toContain("calcom_delete_attendee");
      // Teams
      expect(integration.tools).toContain("calcom_list_teams");
      expect(integration.tools).toContain("calcom_get_team");
      expect(integration.tools).toContain("calcom_create_team");
      expect(integration.tools).toContain("calcom_update_team");
      expect(integration.tools).toContain("calcom_delete_team");
      // Memberships
      expect(integration.tools).toContain("calcom_list_memberships");
      expect(integration.tools).toContain("calcom_get_membership");
      expect(integration.tools).toContain("calcom_create_membership");
      expect(integration.tools).toContain("calcom_update_membership");
      expect(integration.tools).toContain("calcom_delete_membership");
      // Webhooks
      expect(integration.tools).toContain("calcom_list_webhooks");
      expect(integration.tools).toContain("calcom_get_webhook");
      expect(integration.tools).toContain("calcom_create_webhook");
      expect(integration.tools).toContain("calcom_update_webhook");
      expect(integration.tools).toContain("calcom_delete_webhook");
      // Payments
      expect(integration.tools).toContain("calcom_list_payments");
      expect(integration.tools).toContain("calcom_get_payment");
      // Users
      expect(integration.tools).toContain("calcom_list_users");
      expect(integration.tools).toContain("calcom_get_user");
      expect(integration.tools).toContain("calcom_create_user");
      expect(integration.tools).toContain("calcom_update_user");
      expect(integration.tools).toContain("calcom_delete_user");
      // User Profile
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

  describe("Canva Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = canvaIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("canva");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = canvaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["design:meta:read", "folder:read"],
      });

      expect(integration.oauth?.provider).toBe("canva");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["design:meta:read", "folder:read"]);
    });

    test("includes expected tools", () => {
      const integration = canvaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("canva_list_designs");
      expect(integration.tools).toContain("canva_get_design");
      expect(integration.tools).toContain("canva_create_export_job");
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = canvaIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = rampIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = onedriveIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("onedrive_list_files");
      expect(integration.tools).toContain("onedrive_get_file");
      expect(integration.tools).toContain("onedrive_upload_file");
      expect(integration.tools).toContain("onedrive_delete_file");
      expect(integration.tools).toContain("onedrive_search_files");
      expect(integration.tools).toContain("onedrive_share_file");
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

  describe("Dropbox Integration", () => {
    test("registers provider name dropbox", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.id).toBe("dropbox");
      expect(integration.oauth?.provider).toBe("dropbox");
    });

    test("uses OAuth flow, not API key auth", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.authType).toBe("oauth");
      expect(integration.oauth).toBeDefined();
      expect(integration.getHeaders).toBeUndefined();
    });

    test("passes custom scopes through correctly", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: [
          "account_info.read",
          "files.metadata.read",
          "sharing.read",
        ],
      });

      expect(integration.oauth?.scopes).toEqual([
        "account_info.read",
        "files.metadata.read",
        "sharing.read",
      ]);
    });

    test("defaults cleanly when scopes are omitted", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("validates scopes input", () => {
      expect(() =>
        dropboxIntegration({
          scopes: "not-an-array" as any,
        })
      ).toThrow("dropboxIntegration scopes must be an array of strings");

      expect(() =>
        dropboxIntegration({
          scopes: ["ok", 123 as any],
        })
      ).toThrow("dropboxIntegration scopes must be an array of strings");
    });

    test("includes expected tools", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("dropbox_get_current_account");
      expect(integration.tools).toContain("dropbox_list_folder");
      expect(integration.tools).toContain("dropbox_upload_text_file");
      expect(integration.tools).toContain("dropbox_create_shared_link");
    });

    test("has lifecycle hooks defined", () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = dropboxIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Dropbox Paper Integration", () => {
    test("registers provider name paper", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.id).toBe("paper");
      expect(integration.oauth?.provider).toBe("paper");
    });

    test("uses OAuth flow, not API key auth", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.authType).toBe("oauth");
      expect(integration.oauth).toBeDefined();
      expect(integration.getHeaders).toBeUndefined();
    });

    test("uses default scopes when none provided", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeArray();
      expect(integration.oauth?.scopes?.length).toBe(4);
      expect(integration.oauth?.scopes).toContain("files.content.write");
    });

    test("accepts custom scopes", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["files.content.read"],
      });

      expect(integration.oauth?.scopes).toEqual(["files.content.read"]);
    });

    test("validates scopes input", () => {
      expect(() =>
        paperIntegration({
          scopes: "not-an-array" as any,
        })
      ).toThrow("paperIntegration scopes must be an array of strings");

      expect(() =>
        paperIntegration({
          scopes: ["ok", 123 as any],
        })
      ).toThrow("paperIntegration scopes must be an array of strings");
    });

    test("includes expected tools", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("paper_create_doc");
      expect(integration.tools).toContain("paper_update_doc");
      expect(integration.tools).toContain("paper_export_doc");
    });

    test("has lifecycle hooks defined", () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = paperIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });

    test("falls back to Dropbox env credentials", () => {
      const origPaperId = process.env.PAPER_CLIENT_ID;
      const origPaperSecret = process.env.PAPER_CLIENT_SECRET;
      const origDbId = process.env.DROPBOX_CLIENT_ID;
      const origDbSecret = process.env.DROPBOX_CLIENT_SECRET;

      delete process.env.PAPER_CLIENT_ID;
      delete process.env.PAPER_CLIENT_SECRET;
      process.env.DROPBOX_CLIENT_ID = "from-dropbox-id";
      process.env.DROPBOX_CLIENT_SECRET = "from-dropbox-secret";

      const integration = paperIntegration();

      expect(integration.oauth?.clientId).toBe("from-dropbox-id");
      expect(integration.oauth?.clientSecret).toBe("from-dropbox-secret");

      if (origPaperId === undefined) delete process.env.PAPER_CLIENT_ID;
      else process.env.PAPER_CLIENT_ID = origPaperId;
      if (origPaperSecret === undefined) delete process.env.PAPER_CLIENT_SECRET;
      else process.env.PAPER_CLIENT_SECRET = origPaperSecret;
      if (origDbId === undefined) delete process.env.DROPBOX_CLIENT_ID;
      else process.env.DROPBOX_CLIENT_ID = origDbId;
      if (origDbSecret === undefined) delete process.env.DROPBOX_CLIENT_SECRET;
      else process.env.DROPBOX_CLIENT_SECRET = origDbSecret;
    });
  });

  describe("Google Docs Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gdocsIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gdocs");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gdocsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gdocs");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gdocsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = gdocsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gdocs_list");
      expect(integration.tools).toContain("gdocs_get");
      expect(integration.tools).toContain("gdocs_create");
      expect(integration.tools).toContain("gdocs_append_text");
      expect(integration.tools).toContain("gdocs_replace_text");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gdocsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gdocsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Sheets Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gsheetsIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gsheets");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gsheetsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gsheets");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gsheetsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = gsheetsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gsheets_list");
      expect(integration.tools).toContain("gsheets_get");
      expect(integration.tools).toContain("gsheets_get_values");
      expect(integration.tools).toContain("gsheets_update_values");
      expect(integration.tools).toContain("gsheets_create");
      expect(integration.tools).toContain("gsheets_append_values");
      expect(integration.tools).toContain("gsheets_clear_values");
      expect(integration.tools).toContain("gsheets_batch_update_values");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gsheetsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gsheetsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Google Slides Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = gslidesIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("gslides");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = gslidesIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.provider).toBe("gslides");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
    });

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = gslidesIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = gslidesIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("gslides_list");
      expect(integration.tools).toContain("gslides_get");
      expect(integration.tools).toContain("gslides_get_page");
      expect(integration.tools).toContain("gslides_create");
      expect(integration.tools).toContain("gslides_add_slide");
      expect(integration.tools).toContain("gslides_delete_slide");
      expect(integration.tools).toContain("gslides_update_text");
    });

    test("has lifecycle hooks defined", () => {
      const integration = gslidesIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = gslidesIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = polarIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

  describe("PlanetScale Integration", () => {
    test("creates integration with default OAuth configuration", () => {
      const integration = planetscaleIntegration({
        clientId: "pscale-client-id",
        clientSecret: "pscale-client-secret",
      });

      expect(integration.id).toBe("planetscale");
      expect(integration.name).toBe("PlanetScale");
      expect(integration.category).toBe("Infrastructure");
      expect(integration.oauth?.provider).toBe("planetscale");
      expect(integration.oauth?.scopes).toContain("database:read_branches");
      expect((integration.oauth?.config as any).authorization_endpoint).toBe(
        "https://auth.planetscale.com/oauth/authorize"
      );
      expect((integration.oauth?.config as any).token_endpoint).toBe("https://auth.planetscale.com/oauth/token");
      expect((integration.oauth?.config as any).apiBaseUrl).toBe("https://api.planetscale.com/v1");
      expect(integration.tools).toContain("planetscale_list_organizations");
      expect(integration.tools).toContain("planetscale_get_deploy_request");
      expect(integration.tools).toHaveLength(9);
    });
  });

  describe("Facebook Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = facebookIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("facebook");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = facebookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["public_profile", "pages_show_list"],
      });

      expect(integration.oauth?.provider).toBe("facebook");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["public_profile", "pages_show_list"]);
    });

    test("includes expected tools", () => {
      const integration = facebookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("facebook_get_me");
      expect(integration.tools).toContain("facebook_list_pages");
      expect(integration.tools).toContain("facebook_create_page_post");
    });

    test("has lifecycle hooks defined", () => {
      const integration = facebookIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = facebookIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = figmaIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = intercomIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = hubspotIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

  describe("Instagram Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = instagramIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("instagram");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = instagramIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["pages_show_list"],
      });

      expect(integration.oauth?.provider).toBe("instagram");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["pages_show_list"]);
    });

    test("uses default scopes when none provided", () => {
      const integration = instagramIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("instagram_basic");
    });

    test("includes expected tools", () => {
      const integration = instagramIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("instagram_list_pages");
      expect(integration.tools).toContain("instagram_list_media");
    });

    test("has lifecycle hooks defined", () => {
      const integration = instagramIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = instagramIntegration({
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

    test("does not set scopes when not provided (server provides defaults)", () => {
      const integration = youtubeIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toBeUndefined();
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

  describe("TikTok Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = tiktokIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("tiktok");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
    });

    test("includes OAuth configuration", () => {
      const integration = tiktokIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
        scopes: ["user.info.basic"],
      });

      expect(integration.oauth?.provider).toBe("tiktok");
      expect(integration.oauth?.clientId).toBe("test-id");
      expect(integration.oauth?.clientSecret).toBe("test-secret");
      expect(integration.oauth?.scopes).toEqual(["user.info.basic"]);
    });

    test("uses default scopes when none provided", () => {
      const integration = tiktokIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.oauth?.scopes).toContain("user.info.basic");
      expect(integration.oauth?.scopes).toContain("video.list");
    });

    test("includes expected tools", () => {
      const integration = tiktokIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.tools).toContain("tiktok_get_user_info");
      expect(integration.tools).toContain("tiktok_list_videos");
      expect(integration.tools).toContain("tiktok_query_videos");
    });

    test("has lifecycle hooks defined", () => {
      const integration = tiktokIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = tiktokIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });

      await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
      await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
    });
  });

  describe("Cursor Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = cursorIntegration({
        apiKey: "test-api-key",
      });

      expect(integration.id).toBe("cursor");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeUndefined();
    });

    test("does not include OAuth configuration (uses basic auth)", () => {
      const integration = cursorIntegration({
        apiKey: "test-api-key",
      });

      expect(integration.oauth).toBeUndefined();
    });

    test("includes expected tools", () => {
      const integration = cursorIntegration({
        apiKey: "test-api-key",
      });

      expect(integration.tools).toContain("cursor_list_agents");
      expect(integration.tools).toContain("cursor_get_agent");
      expect(integration.tools).toContain("cursor_get_conversation");
      expect(integration.tools).toContain("cursor_launch_agent");
      expect(integration.tools).toContain("cursor_followup_agent");
      expect(integration.tools).toContain("cursor_stop_agent");
      expect(integration.tools).toContain("cursor_delete_agent");
      expect(integration.tools).toContain("cursor_get_me");
      expect(integration.tools).toContain("cursor_list_models");
      expect(integration.tools).toContain("cursor_list_repositories");
    });

    test("has lifecycle hooks defined", () => {
      const integration = cursorIntegration({
        apiKey: "test-api-key",
      });

      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });

    test("lifecycle hooks execute successfully", async () => {
      const integration = cursorIntegration({
        apiKey: "test-api-key",
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

  describe("Sentry Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = sentryIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("sentry");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.oauth?.provider).toBe("sentry");
    });

    test("includes default scopes", () => {
      const integration = sentryIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.oauth?.scopes).toContain("org:read");
      expect(integration.oauth?.scopes).toContain("event:read");
    });

    test("has lifecycle hooks defined", () => {
      const integration = sentryIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Datadog Integration", () => {
    test("creates OAuth integration with correct structure", () => {
      const integration = datadogIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("datadog");
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.oauth?.provider).toBe("datadog");
    });

    test("includes default scopes", () => {
      const integration = datadogIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.oauth?.scopes).toContain("metrics_read");
    });

    test("has lifecycle hooks defined", () => {
      const integration = datadogIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Netlify Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = netlifyIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("netlify");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.oauth?.provider).toBe("netlify");
    });

    test("has empty scopes (full access token)", () => {
      const integration = netlifyIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.oauth?.scopes).toEqual([]);
    });

    test("has lifecycle hooks defined", () => {
      const integration = netlifyIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Supabase Integration", () => {
    test("creates OAuth integration with correct structure", () => {
      const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
      delete process.env.SUPABASE_ACCESS_TOKEN;

      const integration = supabaseIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("supabase");
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.oauth?.provider).toBe("supabase");

      if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
      else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
    });

    test("has lifecycle hooks defined", () => {
      const originalPat = process.env.SUPABASE_ACCESS_TOKEN;
      delete process.env.SUPABASE_ACCESS_TOKEN;

      const integration = supabaseIntegration({
        clientId: "id",
        clientSecret: "secret",
      });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();

      if (originalPat === undefined) delete process.env.SUPABASE_ACCESS_TOKEN;
      else process.env.SUPABASE_ACCESS_TOKEN = originalPat;
    });
  });

  describe("Databricks Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = databricksIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
        workspaceHost: "https://dbc-test.cloud.databricks.com",
      });

      expect(integration.id).toBe("databricks");
      expect(integration.oauth?.provider).toBe("databricks");
      expect(integration.tools.length).toBeGreaterThan(0);
    });

    test("has lifecycle hooks defined", () => {
      const integration = databricksIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Jira Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = jiraIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("jira");
      expect(integration.tools).toBeArray();
      expect(integration.tools.length).toBeGreaterThan(0);
      expect(integration.oauth).toBeDefined();
      expect(integration.oauth?.provider).toBe("jira");
    });

    test("includes default scopes", () => {
      const integration = jiraIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.oauth?.scopes).toContain("read:jira-work");
      expect(integration.oauth?.scopes).toContain("write:jira-work");
    });

    test("has lifecycle hooks defined", () => {
      const integration = jiraIntegration({ clientId: "id", clientSecret: "secret" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("ClickUp Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = clickupIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("clickup");
      expect(integration.oauth?.provider).toBe("clickup");
      expect(integration.tools.length).toBeGreaterThan(0);
    });

    test("has lifecycle hooks defined", () => {
      const integration = clickupIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Threads Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = threadsIntegration({
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(integration.id).toBe("threads");
      expect(integration.oauth?.provider).toBe("threads");
      expect(integration.tools.length).toBeGreaterThan(0);
    });

    test("has lifecycle hooks defined", () => {
      const integration = threadsIntegration({
        clientId: "test-id",
        clientSecret: "test-secret",
      });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Resend Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = resendIntegration({ apiKey: "re_test" });
      expect(integration.id).toBe("resend");
      expect(integration.authType).toBe("apiKey");
      expect(integration.tools).toContain("resend_send_email");
    });

    test("has lifecycle hooks defined", () => {
      const integration = resendIntegration({ apiKey: "re_k" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Wix Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = wixIntegration({
        apiKey: "key",
        siteId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(integration.id).toBe("wix");
      expect(integration.authType).toBe("apiKey");
      expect(integration.tools).toContain("wix_query_products");
      expect(integration.tools).toContain("wix_search_orders");
    });

    test("has lifecycle hooks defined", () => {
      const integration = wixIntegration({ apiKey: "k", siteId: "s" });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
    });
  });

  describe("Redis Cloud Integration", () => {
    test("creates integration with correct structure", () => {
      const integration = redisIntegration({
        accountKey: "acc",
        secretKey: "sec",
      });
      expect(integration.id).toBe("redis");
      expect(integration.authType).toBe("apiKey");
      expect(integration.tools).toContain("redis_list_subscriptions");
    });

    test("has lifecycle hooks defined", () => {
      const integration = redisIntegration({
        accountKey: "a",
        secretKey: "b",
      });
      expect(integration.onInit).toBeDefined();
      expect(integration.onAfterConnect).toBeDefined();
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
