/**
 * Google Keep Integration
 * Enables Google Keep tools with OAuth configuration.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Keep");

export interface GkeepIntegrationConfig {
  /** Google OAuth client ID (defaults to GKEEP_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GKEEP_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes (default uses https://www.googleapis.com/auth/keep on the server) */
  scopes?: string[];
  /** Optional OAuth scopes, e.g. https://www.googleapis.com/auth/keep.readonly */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GKEEP_TOOLS = [
  "gkeep_list_notes",
  "gkeep_get_note",
  "gkeep_create_text_note",
  "gkeep_create_list_note",
  "gkeep_delete_note",
  "gkeep_download_attachment",
  "gkeep_batch_create_permissions",
  "gkeep_batch_delete_permissions",
] as const;

export function gkeepIntegration(config: GkeepIntegrationConfig = {}): MCPIntegration<"gkeep"> {
  const oauth: OAuthConfig = {
    provider: "gkeep",
    clientId: config.clientId ?? getEnv("GKEEP_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GKEEP_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "gkeep",
    name: "Google Keep",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_keep.png",
    description: "Manage Google Keep notes, attachments, and sharing permissions",
    category: "Productivity",
    tools: [...GKEEP_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Keep integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Keep integration connected");
    },
  };
}

export type GkeepTools = (typeof GKEEP_TOOLS)[number];

export type { GkeepIntegrationClient } from "./gkeep-client.js";
