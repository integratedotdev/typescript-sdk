/**
 * Google Sheets Integration
 * Enables Google Sheets tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Sheets');

export interface GSheetsIntegrationConfig {
  /** Google OAuth client ID (defaults to GSHEETS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GSHEETS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GSHEETS_TOOLS = [
  "gsheets_list",
  "gsheets_get",
  "gsheets_get_values",
  "gsheets_update_values",
  "gsheets_create",
  "gsheets_append_values",
  "gsheets_clear_values",
  "gsheets_batch_update_values",
] as const;

export function gsheetsIntegration(config: GSheetsIntegrationConfig = {}): MCPIntegration<"gsheets"> {
  const oauth: OAuthConfig = {
    provider: "gsheets",
    clientId: config.clientId ?? getEnv('GSHEETS_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GSHEETS_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "gsheets",
    name: "Google Sheets",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_sheets.png",
    tools: [...GSHEETS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Sheets integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Sheets integration connected");
    },
  };
}

export type GSheetsTools = typeof GSHEETS_TOOLS[number];
export type { GSheetsIntegrationClient } from "./gsheets-client.js";
