/**
 * Polar Integration
 * Enables Polar tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Polar');

/**
 * Polar integration configuration
 * 
 * SERVER-SIDE: Automatically reads POLAR_CLIENT_ID and POLAR_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface PolarIntegrationConfig {
  /** Polar OAuth client ID (defaults to POLAR_CLIENT_ID env var) */
  clientId?: string;
  /** Polar OAuth client secret (defaults to POLAR_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['products:read', 'subscriptions:read', 'customers:read', 'orders:read', 'benefits:read']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** Polar API base URL (default: https://api.polar.sh) */
  apiBaseUrl?: string;
}

/**
 * Default Polar tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const POLAR_TOOLS = [
  "polar_list_products",
  "polar_get_product",
  "polar_list_subscriptions",
  "polar_get_subscription",
  "polar_list_customers",
  "polar_get_customer",
  "polar_list_orders",
  "polar_get_order",
  "polar_list_benefits",
] as const;


export function polarIntegration(config: PolarIntegrationConfig = {}): MCPIntegration<"polar"> {
  const oauth: OAuthConfig = {
    provider: "polar",
    clientId: config.clientId ?? getEnv('POLAR_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('POLAR_CLIENT_SECRET'),
    scopes: config.scopes || ["products:read", "subscriptions:read", "customers:read", "orders:read", "benefits:read"],
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.polar.sh",
      ...config,
    },
  };

  return {
    id: "polar",
    tools: [...POLAR_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Polar integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Polar integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type PolarTools = typeof POLAR_TOOLS[number];

/**
 * Export Polar client types
 */
export type { PolarIntegrationClient } from "./polar-client.js";
