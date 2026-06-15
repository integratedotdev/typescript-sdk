/**
 * Google Keep Integration
 * Enables Google Keep tools with OAuth configuration.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Keep");

export interface GoogleKeepIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_KEEP_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_KEEP_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes (default uses https://www.googleapis.com/auth/keep on the server) */
  scopes?: string[];
  /** Optional OAuth scopes, e.g. https://www.googleapis.com/auth/keep.readonly */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_KEEP_TOOLS = [
  "google_keep_list_notes",
  "google_keep_get_note",
  "google_keep_create_text_note",
  "google_keep_create_list_note",
  "google_keep_delete_note",
  "google_keep_download_attachment",
  "google_keep_batch_create_permissions",
  "google_keep_batch_delete_permissions",
] as const;

export function googleKeepIntegration(config: GoogleKeepIntegrationConfig = {}): MCPIntegration<"google_keep"> {
  const oauth: OAuthConfig = {
    provider: "google_keep",
    clientId: config.clientId ?? getEnv("GOOGLE_KEEP_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_KEEP_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "google_keep",
    name: "Google Keep",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_keep.png",
    description: "Manage Google Keep notes, attachments, and sharing permissions",
    category: "Productivity",
    tools: [...GOOGLE_KEEP_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Keep integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Keep integration connected");
    },
  };
}

export type GoogleKeepTools = (typeof GOOGLE_KEEP_TOOLS)[number];

export type { GoogleKeepIntegrationClient } from "./google_keep-client.js";
