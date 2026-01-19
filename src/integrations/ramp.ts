/**
 * Ramp Integration
 * Enables Ramp tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Ramp');

/**
 * Ramp integration configuration
 * 
 * SERVER-SIDE: Automatically reads RAMP_CLIENT_ID and RAMP_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface RampIntegrationConfig {
  /** Ramp OAuth client ID (defaults to RAMP_CLIENT_ID env var) */
  clientId?: string;
  /** Ramp OAuth client secret (defaults to RAMP_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['transactions:read', 'cards:read', 'users:read']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** Ramp API base URL (default: https://api.ramp.com/v1) */
  apiBaseUrl?: string;
}

/**
 * Default Ramp tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const RAMP_TOOLS = [
  "ramp_list_transactions",
  "ramp_get_transaction",
  "ramp_list_cards",
  "ramp_get_card",
  "ramp_list_users",
  "ramp_get_user",
  "ramp_list_departments",
  "ramp_list_reimbursements",
  "ramp_get_spend_limits",
] as const;


export function rampIntegration(config: RampIntegrationConfig = {}): MCPIntegration<"ramp"> {
  const oauth: OAuthConfig = {
    provider: "ramp",
    clientId: config.clientId ?? getEnv('RAMP_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('RAMP_CLIENT_SECRET'),
    scopes: config.scopes || ["transactions:read", "cards:read", "users:read"],
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.ramp.com/v1",
      ...config,
    },
  };

  return {
    id: "ramp",
    name: "Ramp",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/ramp.jpeg",
    tools: [...RAMP_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Ramp integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Ramp integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type RampTools = typeof RAMP_TOOLS[number];

/**
 * Export Ramp client types
 */
export type { RampIntegrationClient } from "./ramp-client.js";
