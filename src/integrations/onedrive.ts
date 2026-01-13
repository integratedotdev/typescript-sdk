/**
 * OneDrive Integration
 * Enables OneDrive tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('OneDrive');

/**
 * OneDrive integration configuration
 * 
 * SERVER-SIDE: Automatically reads ONEDRIVE_CLIENT_ID and ONEDRIVE_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface OneDriveIntegrationConfig {
  /** OneDrive OAuth client ID (defaults to ONEDRIVE_CLIENT_ID env var) */
  clientId?: string;
  /** OneDrive OAuth client secret (defaults to ONEDRIVE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['Files.Read', 'Files.ReadWrite', 'offline_access']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default OneDrive tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const ONEDRIVE_TOOLS = [
  "onedrive_list_files",
  "onedrive_get_file",
  "onedrive_download_file",
  "onedrive_upload_file",
  "onedrive_delete_file",
  "onedrive_search_files",
  "onedrive_share_file",
  "onedrive_word_get_content",
  "onedrive_excel_get_worksheets",
  "onedrive_excel_get_range",
  "onedrive_excel_update_range",
  "onedrive_powerpoint_get_slides",
] as const;


export function onedriveIntegration(config: OneDriveIntegrationConfig = {}): MCPIntegration<"onedrive"> {
  const oauth: OAuthConfig = {
    provider: "onedrive",
    clientId: config.clientId ?? getEnv('ONEDRIVE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('ONEDRIVE_CLIENT_SECRET'),
    scopes: config.scopes || ["Files.Read", "Files.ReadWrite", "offline_access"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "onedrive",
    tools: [...ONEDRIVE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("OneDrive integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("OneDrive integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type OneDriveTools = typeof ONEDRIVE_TOOLS[number];

/**
 * Export OneDrive client types
 */
export type { OneDriveIntegrationClient } from "./onedrive-client.js";
