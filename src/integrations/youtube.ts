/**
 * YouTube Integration
 * Enables YouTube tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('YouTube');

/**
 * YouTube integration configuration
 * 
 * SERVER-SIDE: Automatically reads YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface YouTubeIntegrationConfig {
  /** YouTube OAuth client ID (defaults to YOUTUBE_CLIENT_ID env var) */
  clientId?: string;
  /** YouTube OAuth client secret (defaults to YOUTUBE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['https://www.googleapis.com/auth/youtube.force-ssl']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default YouTube tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const YOUTUBE_TOOLS = [
  // Read
  "youtube_search",
  "youtube_get_video",
  "youtube_get_my_channel",
  "youtube_get_channel",
  "youtube_list_my_videos",
  "youtube_get_video_rating",
  "youtube_list_playlists",
  "youtube_get_playlist",
  "youtube_list_playlist_items",
  "youtube_list_subscriptions",
  "youtube_list_comments",
  "youtube_list_comment_replies",
  "youtube_get_captions",
  // Write — engagement
  "youtube_rate_video",
  "youtube_subscribe",
  "youtube_unsubscribe",
  "youtube_add_comment",
  "youtube_reply_to_comment",
  // Write — playlists
  "youtube_create_playlist",
  "youtube_update_playlist",
  "youtube_delete_playlist",
  "youtube_add_to_playlist",
  "youtube_remove_from_playlist",
  // Write — video management
  "youtube_update_video",
] as const;


export function youtubeIntegration(config: YouTubeIntegrationConfig = {}): MCPIntegration<"youtube"> {
  const oauth: OAuthConfig = {
    provider: "youtube",
    clientId: config.clientId ?? getEnv('YOUTUBE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('YOUTUBE_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "youtube",
    name: "YouTube",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/youtube.jpeg",
    tools: [...YOUTUBE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("YouTube integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("YouTube integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type YouTubeTools = typeof YOUTUBE_TOOLS[number];

/**
 * Export YouTube client types
 */
export type { YouTubeIntegrationClient } from "./youtube-client.js";
