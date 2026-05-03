/**
 * Facebook Integration
 * Enables Facebook Graph API tools for Pages (posts, comments, insights) with OAuth.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Facebook");

const FACEBOOK_SCOPES = [
  "public_profile",
  "email",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "pages_read_user_content",
  "pages_manage_engagement",
] as const;

const FACEBOOK_TOOLS = [
  "facebook_get_me",
  "facebook_list_pages",
  "facebook_list_page_posts",
  "facebook_get_object",
  "facebook_create_page_post",
  "facebook_delete_object",
  "facebook_list_comments",
  "facebook_publish_comment",
  "facebook_get_insights",
  "facebook_set_comment_visibility",
  "facebook_like_object",
] as const;

export interface FacebookIntegrationConfig {
  /** Facebook app OAuth client ID (defaults to FACEBOOK_CLIENT_ID env var) */
  clientId?: string;
  /** Facebook app OAuth client secret (defaults to FACEBOOK_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function facebookIntegration(config: FacebookIntegrationConfig = {}): MCPIntegration<"facebook"> {
  const oauth: OAuthConfig = {
    provider: "facebook",
    clientId: config.clientId ?? getEnv("FACEBOOK_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("FACEBOOK_CLIENT_SECRET"),
    scopes: config.scopes ?? [...FACEBOOK_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://www.facebook.com/v18.0/dialog/oauth",
      token_endpoint: "https://graph.facebook.com/v18.0/oauth/access_token",
      response_type: "code",
      grant_types_supported: ["authorization_code"],
    },
  };

  return {
    id: "facebook",
    name: "Facebook",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/facebook.png",
    description: "Manage Facebook Page posts, comments, reactions, and insights via the Graph API",
    category: "Social Media",
    tools: [...FACEBOOK_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Facebook integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Facebook integration connected");
    },
  };
}

export type FacebookTools = (typeof FACEBOOK_TOOLS)[number];
export type FacebookScopes = (typeof FACEBOOK_SCOPES)[number];

export type { FacebookIntegrationClient } from "./facebook-client.js";
