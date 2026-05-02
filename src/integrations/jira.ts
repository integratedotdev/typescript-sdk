/**
 * Jira Integration
 * Enables Jira project management tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Jira");

const JIRA_SCOPES = [
  "read:jira-work",
  "write:jira-work",
  "read:account",
  "offline_access",
] as const;

const JIRA_TOOLS = [
  "jira_list_projects",
  "jira_get_project",
  "jira_get_issue_types",
  "jira_search_issues",
  "jira_get_issue",
  "jira_create_issue",
  "jira_update_issue",
  "jira_get_transitions",
  "jira_transition_issue",
  "jira_add_comment",
  "jira_assign_issue",
  "jira_list_boards",
  "jira_list_sprints",
] as const;

export interface JiraIntegrationConfig {
  /** Jira OAuth client ID (defaults to JIRA_CLIENT_ID env var) */
  clientId?: string;
  /** Jira OAuth client secret (defaults to JIRA_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
}

export function jiraIntegration(config: JiraIntegrationConfig = {}): MCPIntegration<"jira"> {
  const oauth: OAuthConfig = {
    provider: "jira",
    clientId: config.clientId ?? getEnv("JIRA_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("JIRA_CLIENT_SECRET"),
    scopes: config.scopes ?? [...JIRA_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://auth.atlassian.com/authorize",
      token_endpoint: "https://auth.atlassian.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "jira",
    name: "Jira",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/jira.png",
    description: "Manage Jira issues, projects, sprints, and boards",
    category: "Engineering",
    tools: [...JIRA_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Jira integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Jira integration connected");
    },
  };
}

export type JiraTools = (typeof JIRA_TOOLS)[number];
export type JiraScopes = (typeof JIRA_SCOPES)[number];

export type { JiraIntegrationClient } from "./jira-client.js";
