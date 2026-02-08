/**
 * Notion Integration
 * Enables Notion tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Notion');
export interface NotionIntegrationConfig {
  /** Notion OAuth client ID (defaults to NOTION_CLIENT_ID env var) */
  clientId?: string;
  /** Notion OAuth client secret (defaults to NOTION_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
  /** 
   * Notion OAuth owner parameter
   * - 'user': Integration will be added to the user's workspace (default)
   * - 'workspace': Integration will be added at workspace level
   */
  owner?: 'user' | 'workspace';
}

/**
 * Default Notion tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const NOTION_TOOLS = [
  // Search
  "notion_search",
  // Pages
  "notion_get_page",
  "notion_create_page",
  "notion_update_page",
  "notion_get_page_property",
  // Databases
  "notion_get_database",
  "notion_query_database",
  "notion_create_database",
  "notion_update_database",
  // Blocks
  "notion_get_block",
  "notion_get_block_children",
  "notion_append_blocks",
  "notion_update_block",
  "notion_delete_block",
  // Users
  "notion_get_user",
  "notion_get_current_user",
  "notion_list_users",
  // Comments
  "notion_create_comment",
  "notion_list_comments",
  // Page Move
  "notion_move_page",
  // File Uploads
  "notion_create_file_upload",
  "notion_send_file_upload",
  "notion_complete_file_upload",
  "notion_get_file_upload",
  // Data Sources
  "notion_create_data_source",
  "notion_get_data_source",
  "notion_update_data_source",
  "notion_query_data_source",
] as const;

/**
 * Notion Integration
 * 
 * Enables Notion integration with OAuth authentication.
 * 
 * By default, reads NOTION_CLIENT_ID and NOTION_CLIENT_SECRET from environment variables.
 * You can override these by providing explicit values in the config.
 * 
 * Note: Notion's OAuth has special requirements:
 * - Uses a custom authorization endpoint (https://api.notion.com/v1/oauth/authorize)
 * - Requires an 'owner' parameter ('user' or 'workspace')
 * - Does not use traditional OAuth scopes
 * 
 */
export function notionIntegration(config: NotionIntegrationConfig = {}): MCPIntegration<"notion"> {
  const oauth: OAuthConfig = {
    provider: "notion",
    clientId: config.clientId ?? getEnv('NOTION_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('NOTION_CLIENT_SECRET'),
    scopes: [], // Notion doesn't use traditional OAuth scopes
    redirectUri: config.redirectUri,
    config: {
      owner: config.owner || 'user',
      authorization_endpoint: 'https://api.notion.com/v1/oauth/authorize',
      token_endpoint: 'https://api.notion.com/v1/oauth/token',
      ...config,
    },
  };

  return {
    id: "notion",
    name: "Notion",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/notion.jpeg",
    tools: [...NOTION_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Notion integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Notion integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type NotionTools = typeof NOTION_TOOLS[number];

/**
 * Export Notion client types
 */
export type { NotionIntegrationClient } from "./notion-client.js";

