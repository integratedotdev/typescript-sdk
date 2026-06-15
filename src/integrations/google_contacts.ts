/**
 * Google Contacts Integration
 * Enables Google Contacts (People API) tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Contacts");

const GOOGLE_CONTACTS_TOOLS = [
  "google_contacts_batch_get_contacts",
  "google_contacts_copy_other_contact",
  "google_contacts_create_contact",
  "google_contacts_delete_contact",
  "google_contacts_get_person",
  "google_contacts_get_self",
  "google_contacts_list_connections",
  "google_contacts_list_other_contacts",
  "google_contacts_search_contacts",
  "google_contacts_update_contact",
] as const;

export interface GoogleContactsIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_CONTACTS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_CONTACTS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (optional — MCP server defaults include contacts) */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function googleContactsIntegration(config: GoogleContactsIntegrationConfig = {}): MCPIntegration<"google_contacts"> {
  const oauth: OAuthConfig = {
    provider: "google_contacts",
    clientId: config.clientId ?? getEnv("GOOGLE_CONTACTS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_CONTACTS_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "google_contacts",
    name: "Google Contacts",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_contacts.png",
    description: "List, search, create, update, and delete Google Contacts via the People API",
    category: "Communication",
    tools: [...GOOGLE_CONTACTS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Contacts integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Contacts integration connected");
    },
  };
}

export type GoogleContactsTools = (typeof GOOGLE_CONTACTS_TOOLS)[number];

export type { GoogleContactsIntegrationClient } from "./google_contacts-client.js";
