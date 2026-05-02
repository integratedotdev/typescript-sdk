/**
 * PostHog Integration
 * Enables PostHog analytics tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('PostHog');

const DEFAULT_POSTHOG_BASE_URL = "https://us.posthog.com";

const POSTHOG_SCOPES = [
  "openid",
  "profile",
  "email",
  "organization:read",
  "project:read",
  "user:read",
  "query:read",
  "insight:read",
  "dashboard:read",
  "feature_flag:read",
  "experiment:read",
  "annotation:read",
  "cohort:read",
  "person:read",
  "event_definition:read",
  "property_definition:read",
  "session_recording:read",
  "action:read",
] as const;

export interface PostHogIntegrationConfig {
  /** PostHog OAuth client ID (defaults to POSTHOG_CLIENT_ID env var) */
  clientId?: string;
  /** PostHog OAuth client secret (defaults to POSTHOG_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
  /**
   * PostHog app host / base URL.
   * Supports US cloud, EU cloud, or a self-hosted PostHog instance.
   * @default "https://us.posthog.com"
   */
  baseUrl?: string;
}

const POSTHOG_TOOLS = [
  "posthog_get_current_user",
  "posthog_list_organizations",
  "posthog_get_organization",
  "posthog_list_projects",
  "posthog_get_project",
  "posthog_run_hogql_query",
  "posthog_list_insights",
  "posthog_get_insight",
  "posthog_list_dashboards",
  "posthog_get_dashboard",
  "posthog_list_feature_flags",
  "posthog_get_feature_flag",
  "posthog_list_experiments",
  "posthog_get_experiment",
  "posthog_list_annotations",
  "posthog_get_annotation",
  "posthog_list_cohorts",
  "posthog_get_cohort",
  "posthog_list_event_definitions",
  "posthog_get_event_definition",
  "posthog_list_property_definitions",
  "posthog_get_property_definition",
  "posthog_list_persons",
  "posthog_get_person",
  "posthog_list_session_recordings",
  "posthog_get_session_recording",
] as const;

function normalizePostHogBaseUrl(baseUrl?: string): string {
  const value = (baseUrl || DEFAULT_POSTHOG_BASE_URL).trim().replace(/\/+$/, "");
  if (!value) {
    return DEFAULT_POSTHOG_BASE_URL;
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function posthogIntegration(config: PostHogIntegrationConfig = {}): MCPIntegration<"posthog"> {
  const baseUrl = normalizePostHogBaseUrl(config.baseUrl);
  const oauth: OAuthConfig = {
    provider: "posthog",
    clientId: config.clientId ?? getEnv('POSTHOG_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('POSTHOG_CLIENT_SECRET'),
    scopes: config.scopes ?? [...POSTHOG_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      baseUrl,
      apiBaseUrl: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize/`,
      token_endpoint: `${baseUrl}/oauth/token/`,
      token_auth_method: "client_secret_post",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_method: "S256",
    },
  };

  return {
    id: "posthog",
    name: "PostHog",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/posthog.png",
    description: "Read PostHog organizations, projects, insights, flags, and analytics data",
    category: "Analytics",
    tools: [...POSTHOG_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("PostHog integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("PostHog integration connected");
    },
  };
}

export type PostHogTools = typeof POSTHOG_TOOLS[number];
export type PostHogScopes = typeof POSTHOG_SCOPES[number];

export type { PostHogIntegrationClient } from "./posthog-client.js";
