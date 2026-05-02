/**
 * Sentry Integration
 * Enables Sentry error monitoring tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Sentry");

const SENTRY_SCOPES = [
  "org:read",
  "project:read",
  "team:read",
  "member:read",
  "event:read",
  "event:write",
  "project:releases",
] as const;

const SENTRY_TOOLS = [
  "sentry_get_organization",
  "sentry_list_org_projects",
  "sentry_list_org_members",
  "sentry_get_project",
  "sentry_list_issues",
  "sentry_get_issue",
  "sentry_update_issue",
  "sentry_list_issue_events",
  "sentry_list_project_events",
  "sentry_list_releases",
  "sentry_get_release",
  "sentry_create_release",
  "sentry_list_release_commits",
  "sentry_resolve_short_id",
] as const;

export interface SentryIntegrationConfig {
  /** Sentry OAuth client ID (defaults to SENTRY_CLIENT_ID env var) */
  clientId?: string;
  /** Sentry OAuth client secret (defaults to SENTRY_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
}

export function sentryIntegration(config: SentryIntegrationConfig = {}): MCPIntegration<"sentry"> {
  const oauth: OAuthConfig = {
    provider: "sentry",
    clientId: config.clientId ?? getEnv("SENTRY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SENTRY_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SENTRY_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://sentry.io/oauth/authorize/",
      token_endpoint: "https://sentry.io/oauth/token/",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "sentry",
    name: "Sentry",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/sentry.png",
    description: "Monitor Sentry errors, issues, releases, and projects",
    category: "Engineering",
    tools: [...SENTRY_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Sentry integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Sentry integration connected");
    },
  };
}

export type SentryTools = (typeof SENTRY_TOOLS)[number];
export type SentryScopes = (typeof SENTRY_SCOPES)[number];

export type { SentryIntegrationClient } from "./sentry-client.js";
