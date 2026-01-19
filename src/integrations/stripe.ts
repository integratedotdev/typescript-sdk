/**
 * Stripe Integration
 * Enables Stripe tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Stripe');

/**
 * Stripe integration configuration
 * 
 * SERVER-SIDE: Automatically reads STRIPE_CLIENT_ID and STRIPE_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface StripeIntegrationConfig {
  /** Stripe OAuth client ID (defaults to STRIPE_CLIENT_ID env var) */
  clientId?: string;
  /** Stripe OAuth client secret (defaults to STRIPE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['read_write']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Stripe tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const STRIPE_TOOLS = [
  "stripe_list_customers",
  "stripe_get_customer",
  "stripe_create_customer",
  "stripe_list_payments",
  "stripe_get_payment",
  "stripe_create_payment",
  "stripe_list_invoices",
  "stripe_list_subscriptions",
  "stripe_create_subscription",
] as const;


export function stripeIntegration(config: StripeIntegrationConfig = {}): MCPIntegration<"stripe"> {
  const oauth: OAuthConfig = {
    provider: "stripe",
    clientId: config.clientId ?? getEnv('STRIPE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('STRIPE_CLIENT_SECRET'),
    scopes: config.scopes || ["read_write"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "stripe",
    name: "Stripe",
    logoUrl: "https://cdn.simpleicons.org/stripe",
    tools: [...STRIPE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Stripe integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Stripe integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type StripeTools = typeof STRIPE_TOOLS[number];

/**
 * Export Stripe client types
 */
export type { StripeIntegrationClient } from "./stripe-client.js";

