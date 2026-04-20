/**
 * Google Docs Integration
 * Enables Google Docs tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Docs');

export interface GDocsIntegrationConfig {
  /** Google OAuth client ID (defaults to GDOCS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GDOCS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GDOCS_TOOLS = [
  "gdocs_list",
  "gdocs_get",
  "gdocs_create",
  "gdocs_append_text",
  "gdocs_replace_text",
] as const;

export function gdocsIntegration(config: GDocsIntegrationConfig = {}): MCPIntegration<"gdocs"> {
  const oauth: OAuthConfig = {
    provider: "gdocs",
    clientId: config.clientId ?? getEnv('GDOCS_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GDOCS_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "gdocs",
    name: "Google Docs",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_docs.png",
    tools: [...GDOCS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Docs integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Docs integration connected");
    },
  };
}

export type GDocsTools = typeof GDOCS_TOOLS[number];
export type { GDocsIntegrationClient } from "./gdocs-client.js";
