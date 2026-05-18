import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("X");

const X_SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "follows.read",
  "follows.write",
  "like.read",
  "like.write",
  "bookmark.read",
  "bookmark.write",
  "offline.access",
] as const;

const X_TOOLS = [
  "x_get_me",
  "x_get_user",
  "x_search_posts",
  "x_get_user_timeline",
  "x_create_post",
  "x_delete_post",
  "x_like_post",
  "x_get_bookmarks",
  "x_follow_user",
] as const;

export interface XIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function xIntegration(config: XIntegrationConfig = {}): MCPIntegration<"x"> {
  const oauth: OAuthConfig = { provider: "x", clientId: config.clientId ?? getEnv("X_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("X_CLIENT_SECRET"), scopes: config.scopes ?? [...X_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "x", name: "X", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/x.png", description: "Manage X users, posts, timelines, likes, bookmarks, follows, and posting", category: "Social Media", tools: [...X_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("X integration initialized"); },
    async onAfterConnect() { logger.debug("X integration connected"); },
  };
}

export type XTools = (typeof X_TOOLS)[number];
export type XScopes = (typeof X_SCOPES)[number];
export type { XIntegrationClient } from "./x-client.js";
