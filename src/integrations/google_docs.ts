/**
 * Google Docs Integration
 * Enables Google Docs tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Docs');

export interface GDocsIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_DOCS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_DOCS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_DOCS_TOOLS = [
  "google_docs_append_text",
  "google_docs_batch_update",
  "google_docs_create",
  "google_docs_create_comment",
  "google_docs_delete",
  "google_docs_delete_comment",
  "google_docs_get",
  "google_docs_list",
  "google_docs_list_comments",
  "google_docs_replace_text",
] as const;

export function googleDocsIntegration(config: GDocsIntegrationConfig = {}): MCPIntegration<"google_docs"> {
  const oauth: OAuthConfig = {
    provider: "google_docs",
    clientId: config.clientId ?? getEnv('GOOGLE_DOCS_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GOOGLE_DOCS_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "google_docs",
    name: "Google Docs",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_docs.png",
    tools: [...GOOGLE_DOCS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Docs integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Docs integration connected");
    },
  };
}

export type GDocsTools = typeof GOOGLE_DOCS_TOOLS[number];
export type { GDocsIntegrationClient } from "./google_docs-client.js";
