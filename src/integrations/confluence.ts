import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Confluence");

const CONFLUENCE_SCOPES = [
  "read:confluence-content.all",
  "write:confluence-content",
  "read:confluence-space.summary",
  "read:confluence-props",
  "offline_access",
] as const;

const CONFLUENCE_TOOLS = [
  "confluence_list_accessible_resources",
  "confluence_list_spaces",
  "confluence_get_space",
  "confluence_list_pages",
  "confluence_get_page",
  "confluence_create_page",
  "confluence_update_page",
  "confluence_delete_page",
  "confluence_search",
  "confluence_list_comments",
  "confluence_create_comment",
  "confluence_list_attachments",
] as const;

export interface ConfluenceIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function confluenceIntegration(config: ConfluenceIntegrationConfig = {}): MCPIntegration<"confluence"> {
  const oauth: OAuthConfig = {
    provider: "confluence",
    clientId: config.clientId ?? getEnv("ATLASSIAN_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("ATLASSIAN_CLIENT_SECRET"),
    scopes: config.scopes ?? [...CONFLUENCE_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://auth.atlassian.com/authorize",
      token_endpoint: "https://auth.atlassian.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };
  return {
    id: "confluence",
    name: "Confluence Cloud",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/confluence.png",
    description: "Manage Confluence spaces, pages, search, comments, and attachments",
    category: "Productivity",
    tools: [...CONFLUENCE_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Confluence integration initialized"); },
    async onAfterConnect() { logger.debug("Confluence integration connected"); },
  };
}

export type ConfluenceTools = (typeof CONFLUENCE_TOOLS)[number];
export type ConfluenceScopes = (typeof CONFLUENCE_SCOPES)[number];
export type { ConfluenceIntegrationClient } from "./confluence-client.js";

