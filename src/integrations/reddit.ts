import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const REDDIT_TOOLS = [
  "reddit_get_me",
  "reddit_get_subreddit_about",
  "reddit_list_subreddit_posts",
  "reddit_get_post_thread",
  "reddit_search",
  "reddit_submit_post",
  "reddit_comment",
  "reddit_vote",
  "reddit_list_my_subreddits",
  "reddit_list_popular_subreddits",
] as const;

export interface RedditIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function redditIntegration(config: RedditIntegrationConfig = {}): MCPIntegration<"reddit"> {
  const oauth: OAuthConfig = {
    provider: "reddit",
    clientId: config.clientId ?? getEnv("REDDIT_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("REDDIT_CLIENT_SECRET"),
    scopes: config.scopes ?? ["identity", "read", "submit", "vote", "mysubreddits"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
  };

  return {
    id: "reddit",
    name: "Reddit",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/reddit.png",
    tools: [...REDDIT_TOOLS],
    oauth,
  };
}

export type RedditTools = (typeof REDDIT_TOOLS)[number];
export type { RedditIntegrationClient } from "./reddit-client.js";
