import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Threads");

const THREADS_SCOPES = [
  "threads_basic",
  "threads_content_publish",
  "threads_read_replies",
  "threads_manage_replies",
  "threads_manage_insights",
] as const;

const THREADS_OPTIONAL_SCOPES = [
  "threads_keyword_search",
  "threads_profile_discovery",
  "threads_manage_mentions",
] as const;

const THREADS_TOOLS = [
  "threads_get_me",
  "threads_list_user_media",
  "threads_get_media",
  "threads_keyword_search",
  "threads_create_media_container",
  "threads_publish_media_container",
  "threads_get_container_status",
  "threads_list_replies",
  "threads_get_conversation",
  "threads_manage_reply",
  "threads_repost",
  "threads_delete_media",
] as const;

export interface ThreadsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function threadsIntegration(config: ThreadsIntegrationConfig = {}): MCPIntegration<"threads"> {
  const oauth: OAuthConfig = {
    provider: "threads",
    clientId: config.clientId ?? getEnv("THREADS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("THREADS_CLIENT_SECRET"),
    scopes: config.scopes ?? [...THREADS_SCOPES],
    optionalScopes: config.optionalScopes ?? [...THREADS_OPTIONAL_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://threads.net/oauth/authorize",
      token_endpoint: "https://graph.threads.net/oauth/access_token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "threads",
    name: "Threads",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/threads.png",
    description: "Publish Threads posts and manage media, replies, conversations, and keyword search",
    category: "Social",
    tools: [...THREADS_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Threads integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Threads integration connected");
    },
  };
}

export type ThreadsTools = (typeof THREADS_TOOLS)[number];
export type ThreadsScopes = (typeof THREADS_SCOPES)[number];
export type { ThreadsIntegrationClient } from "./threads-client.js";
