/**
 * Dropbox Integration
 * Enables Dropbox tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Dropbox");

export interface DropboxIntegrationOptions {
  /** Dropbox OAuth client ID (defaults to DROPBOX_CLIENT_ID env var) */
  clientId?: string;
  /** Dropbox OAuth client secret (defaults to DROPBOX_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Optional custom scopes. Omit to use the server defaults. */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const DROPBOX_TOOLS = [
  "dropbox_get_current_account",
  "dropbox_get_space_usage",
  "dropbox_list_folder",
  "dropbox_list_folder_continue",
  "dropbox_get_metadata",
  "dropbox_search_files",
  "dropbox_create_folder",
  "dropbox_delete_path",
  "dropbox_move_path",
  "dropbox_copy_path",
  "dropbox_upload_text_file",
  "dropbox_download_file",
  "dropbox_get_temporary_link",
  "dropbox_create_shared_link",
  "dropbox_list_shared_links",
  "dropbox_revoke_shared_link",
] as const;

export function dropboxIntegration(
  options: DropboxIntegrationOptions = {}
): MCPIntegration<"dropbox"> {
  if (
    options.scopes !== undefined &&
    (!Array.isArray(options.scopes) || options.scopes.some((scope) => typeof scope !== "string"))
  ) {
    throw new Error("dropboxIntegration scopes must be an array of strings");
  }

  const oauth: OAuthConfig = {
    provider: "dropbox",
    clientId: options.clientId ?? getEnv("DROPBOX_CLIENT_ID"),
    clientSecret: options.clientSecret ?? getEnv("DROPBOX_CLIENT_SECRET"),
    scopes: options.scopes,
    optionalScopes: options.optionalScopes,
    redirectUri: options.redirectUri,
    config: options,
  };

  return {
    id: "dropbox",
    name: "Dropbox",
    tools: [...DROPBOX_TOOLS],
    authType: "oauth",
    oauth,

    async onInit(_client) {
      logger.debug("Dropbox integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Dropbox integration connected");
    },
  };
}

export type DropboxTools = typeof DROPBOX_TOOLS[number];
