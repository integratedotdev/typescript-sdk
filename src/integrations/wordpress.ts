import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("WordPress");

const WORDPRESS_SCOPES = [
  "global",
] as const;

const WORDPRESS_TOOLS = [
  "wordpress_get_site",
  "wordpress_list_posts",
  "wordpress_get_post",
  "wordpress_create_post",
  "wordpress_update_post",
  "wordpress_list_media",
] as const;

export interface WordpressIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  site?: string;
}

export function wordpressIntegration(config: WordpressIntegrationConfig = {}): MCPIntegration<"wordpress"> {
  const oauth: OAuthConfig = { provider: "wordpress", clientId: config.clientId ?? getEnv("WORDPRESS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("WORDPRESS_CLIENT_SECRET"), scopes: config.scopes ?? [...WORDPRESS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "wordpress", name: "WordPress", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/wordpress.png", description: "Manage WordPress get site, list posts, get post, create post, update post", category: "Websites & CMS", tools: [...WORDPRESS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.site) headers["X-WordPress-Site"] = config.site;
      return headers;
    },
    async onInit() { logger.debug("WordPress integration initialized"); },
    async onAfterConnect() { logger.debug("WordPress integration connected"); },
  };
}

export type WordpressTools = (typeof WORDPRESS_TOOLS)[number];
export type WordpressScopes = (typeof WORDPRESS_SCOPES)[number];
export type { WordpressIntegrationClient } from "./wordpress-client.js";
