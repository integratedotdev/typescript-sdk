/**
 * Google Drive Integration
 * Enables Google Drive tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Drive');

export interface GDriveIntegrationConfig {
  /** Google OAuth client ID (defaults to GDRIVE_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GDRIVE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GDRIVE_TOOLS = [
  "gdrive_list_files",
  "gdrive_get_file",
  "gdrive_create_folder",
  "gdrive_rename_file",
  "gdrive_move_file",
  "gdrive_copy_file",
  "gdrive_delete_file",
  "gdrive_trash_file",
  "gdrive_upload_text_file",
  "gdrive_download_file",
  "gdrive_list_permissions",
  "gdrive_share_file",
  "gdrive_remove_permission",
  "gdrive_get_about",
] as const;

export function gdriveIntegration(config: GDriveIntegrationConfig = {}): MCPIntegration<"gdrive"> {
  const oauth: OAuthConfig = {
    provider: "gdrive",
    clientId: config.clientId ?? getEnv('GDRIVE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GDRIVE_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "gdrive",
    name: "Google Drive",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_drive.png",
    tools: [...GDRIVE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Drive integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Drive integration connected");
    },
  };
}

export type GDriveTools = typeof GDRIVE_TOOLS[number];
export type { GDriveIntegrationClient } from "./gdrive-client.js";
