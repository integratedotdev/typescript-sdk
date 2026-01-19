/**
 * Intercom Integration
 * Enables Intercom tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Intercom');

/**
 * Intercom integration configuration
 * 
 * SERVER-SIDE: Automatically reads INTERCOM_CLIENT_ID and INTERCOM_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface IntercomIntegrationConfig {
  /** Intercom OAuth client ID (defaults to INTERCOM_CLIENT_ID env var) */
  clientId?: string;
  /** Intercom OAuth client secret (defaults to INTERCOM_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (Intercom uses app-level permissions, typically empty) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Intercom tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const INTERCOM_TOOLS = [
  "intercom_list_contacts",
  "intercom_get_contact",
  "intercom_create_contact",
  "intercom_list_conversations",
  "intercom_get_conversation",
  "intercom_reply_conversation",
  "intercom_list_companies",
  "intercom_get_company",
  "intercom_search_contacts",
] as const;


export function intercomIntegration(config: IntercomIntegrationConfig = {}): MCPIntegration<"intercom"> {
  const oauth: OAuthConfig = {
    provider: "intercom",
    clientId: config.clientId ?? getEnv('INTERCOM_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('INTERCOM_CLIENT_SECRET'),
    scopes: config.scopes || [],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "intercom",
    name: "Intercom",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/intercom.png",
    tools: [...INTERCOM_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Intercom integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Intercom integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type IntercomTools = typeof INTERCOM_TOOLS[number];

/**
 * Export Intercom client types
 */
export type { IntercomIntegrationClient } from "./intercom-client.js";
