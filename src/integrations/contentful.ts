import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Contentful");

const CONTENTFUL_SCOPES = [
  "content_management_manage",
] as const;

const CONTENTFUL_TOOLS = [
  "contentful_list_spaces",
  "contentful_get_space",
  "contentful_list_entries",
  "contentful_get_entry",
  "contentful_create_entry",
  "contentful_publish_entry",
] as const;

export interface ContentfulIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function contentfulIntegration(config: ContentfulIntegrationConfig = {}): MCPIntegration<"contentful"> {
  const oauth: OAuthConfig = { provider: "contentful", clientId: config.clientId ?? getEnv("CONTENTFUL_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("CONTENTFUL_CLIENT_SECRET"), scopes: config.scopes ?? [...CONTENTFUL_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "contentful", name: "Contentful", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/contentful.png", description: "Manage Contentful list spaces, get space, list entries, get entry, create entry", category: "Websites & CMS", tools: [...CONTENTFUL_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Contentful integration initialized"); },
    async onAfterConnect() { logger.debug("Contentful integration connected"); },
  };
}

export type ContentfulTools = (typeof CONTENTFUL_TOOLS)[number];
export type ContentfulScopes = (typeof CONTENTFUL_SCOPES)[number];
export type { ContentfulIntegrationClient } from "./contentful-client.js";
