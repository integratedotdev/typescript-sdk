/**
 * Zendesk Integration
 * Enables Zendesk tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Zendesk');

/**
 * Zendesk integration configuration
 * 
 * SERVER-SIDE: Automatically reads ZENDESK_CLIENT_ID and ZENDESK_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface ZendeskIntegrationConfig {
  /** Zendesk OAuth client ID (defaults to ZENDESK_CLIENT_ID env var) */
  clientId?: string;
  /** Zendesk OAuth client secret (defaults to ZENDESK_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['read', 'write']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** Zendesk subdomain (e.g., 'mycompany' for mycompany.zendesk.com) */
  subdomain?: string;
}

/**
 * Default Zendesk tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const ZENDESK_TOOLS = [
  "zendesk_list_tickets",
  "zendesk_get_ticket",
  "zendesk_create_ticket",
  "zendesk_update_ticket",
  "zendesk_add_comment",
  "zendesk_list_users",
  "zendesk_get_user",
  "zendesk_search_tickets",
  "zendesk_list_organizations",
] as const;


export function zendeskIntegration(config: ZendeskIntegrationConfig = {}): MCPIntegration<"zendesk"> {
  const oauth: OAuthConfig = {
    provider: "zendesk",
    clientId: config.clientId ?? getEnv('ZENDESK_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('ZENDESK_CLIENT_SECRET'),
    scopes: config.scopes || ["read", "write"],
    redirectUri: config.redirectUri,
    config: {
      subdomain: config.subdomain ?? getEnv('ZENDESK_SUBDOMAIN'),
      ...config,
    },
  };

  return {
    id: "zendesk",
    tools: [...ZENDESK_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Zendesk integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Zendesk integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type ZendeskTools = typeof ZENDESK_TOOLS[number];

/**
 * Export Zendesk client types
 */
export type { ZendeskIntegrationClient } from "./zendesk-client.js";

