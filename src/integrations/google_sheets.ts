/**
 * Google Sheets Integration
 * Enables Google Sheets tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Sheets');

export interface GSheetsIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_SHEETS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_SHEETS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_SHEETS_TOOLS = [
  "google_sheets_append_values",
  "google_sheets_batch_update",
  "google_sheets_batch_update_values",
  "google_sheets_clear_values",
  "google_sheets_create",
  "google_sheets_delete",
  "google_sheets_get",
  "google_sheets_get_values",
  "google_sheets_list",
  "google_sheets_update_values",
] as const;

export function googleSheetsIntegration(config: GSheetsIntegrationConfig = {}): MCPIntegration<"google_sheets"> {
  const oauth: OAuthConfig = {
    provider: "google_sheets",
    clientId: config.clientId ?? getEnv('GOOGLE_SHEETS_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GOOGLE_SHEETS_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "google_sheets",
    name: "Google Sheets",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_sheets.png",
    tools: [...GOOGLE_SHEETS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Sheets integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Sheets integration connected");
    },
  };
}

export type GSheetsTools = typeof GOOGLE_SHEETS_TOOLS[number];
export type { GSheetsIntegrationClient } from "./google_sheets-client.js";
