/**
 * Google Drive Integration
 * Enables Google Drive tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Drive');

export interface GDriveIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_DRIVE_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_DRIVE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_DRIVE_TOOLS = [
  "google_drive_copy_file",
  "google_drive_create_folder",
  "google_drive_delete_file",
  "google_drive_download_file",
  "google_drive_get_about",
  "google_drive_get_file",
  "google_drive_list_files",
  "google_drive_list_permissions",
  "google_drive_move_file",
  "google_drive_remove_permission",
  "google_drive_rename_file",
  "google_drive_share_file",
  "google_drive_trash_file",
  "google_drive_upload_text_file",
] as const;

export function googleDriveIntegration(config: GDriveIntegrationConfig = {}): MCPIntegration<"google_drive"> {
  const oauth: OAuthConfig = {
    provider: "google_drive",
    clientId: config.clientId ?? getEnv('GOOGLE_DRIVE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GOOGLE_DRIVE_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "google_drive",
    name: "Google Drive",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_drive.png",
    tools: [...GOOGLE_DRIVE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Drive integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Drive integration connected");
    },
  };
}

export type GDriveTools = typeof GOOGLE_DRIVE_TOOLS[number];
export type { GDriveIntegrationClient } from "./google_drive-client.js";
