/**
 * Instagram Integration
 * Enables Instagram Graph API tools (Facebook Login) for professional Instagram accounts.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Instagram");

const INSTAGRAM_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_manage_insights",
  "instagram_manage_comments",
  "instagram_content_publish",
] as const;

const INSTAGRAM_TOOLS = [
  "instagram_list_pages",
  "instagram_get_profile",
  "instagram_list_media",
  "instagram_get_media",
  "instagram_list_comments",
  "instagram_reply_comment",
  "instagram_delete_comment",
  "instagram_hide_comment",
  "instagram_get_media_insights",
  "instagram_get_user_insights",
  "instagram_create_media_container",
  "instagram_publish_media",
  "instagram_list_stories",
  "instagram_list_tagged_media",
] as const;

export interface InstagramIntegrationConfig {
  /** Meta app OAuth client ID (defaults to INSTAGRAM_CLIENT_ID env var) */
  clientId?: string;
  /** Meta app OAuth client secret (defaults to INSTAGRAM_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (defaults match MCP server Instagram provider) */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function instagramIntegration(
  config: InstagramIntegrationConfig = {}
): MCPIntegration<"instagram"> {
  const oauth: OAuthConfig = {
    provider: "instagram",
    clientId: config.clientId ?? getEnv("INSTAGRAM_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("INSTAGRAM_CLIENT_SECRET"),
    scopes: config.scopes ?? [...INSTAGRAM_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://www.facebook.com/v21.0/dialog/oauth",
      token_endpoint: "https://graph.facebook.com/v21.0/oauth/access_token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      ...config,
    },
  };

  return {
    id: "instagram",
    name: "Instagram",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/instagram.png",
    description:
      "Instagram Graph API for professional accounts — pages, media, comments, insights, stories, and publishing.",
    category: "Social Media",
    tools: [...INSTAGRAM_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Instagram integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Instagram integration connected");
    },
  };
}

export type InstagramTools = (typeof INSTAGRAM_TOOLS)[number];
export type InstagramScopes = (typeof INSTAGRAM_SCOPES)[number];

export type { InstagramIntegrationClient } from "./instagram-client.js";
