/**
 * Google Contacts Integration
 * Enables Google Contacts (People API) tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Contacts");

const GCONTACTS_TOOLS = [
  "gcontacts_batch_get_contacts",
  "gcontacts_copy_other_contact",
  "gcontacts_create_contact",
  "gcontacts_delete_contact",
  "gcontacts_get_person",
  "gcontacts_get_self",
  "gcontacts_list_connections",
  "gcontacts_list_other_contacts",
  "gcontacts_search_contacts",
  "gcontacts_update_contact",
] as const;

export interface GcontactsIntegrationConfig {
  /** Google OAuth client ID (defaults to GCONTACTS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GCONTACTS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (optional — MCP server defaults include contacts) */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function gcontactsIntegration(config: GcontactsIntegrationConfig = {}): MCPIntegration<"gcontacts"> {
  const oauth: OAuthConfig = {
    provider: "gcontacts",
    clientId: config.clientId ?? getEnv("GCONTACTS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GCONTACTS_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "gcontacts",
    name: "Google Contacts",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_contacts.png",
    description: "List, search, create, update, and delete Google Contacts via the People API",
    category: "Communication",
    tools: [...GCONTACTS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Contacts integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Contacts integration connected");
    },
  };
}

export type GcontactsTools = (typeof GCONTACTS_TOOLS)[number];

export type { GcontactsIntegrationClient } from "./gcontacts-client.js";
