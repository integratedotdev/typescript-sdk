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
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Stripe tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const STRIPE_TOOLS = [
  // Customers
  "stripe_list_customers",
  "stripe_get_customer",
  "stripe_create_customer",
  "stripe_update_customer",
  "stripe_delete_customer",
  "stripe_search_customers",
  // Payment Intents
  "stripe_list_payments",
  "stripe_get_payment",
  "stripe_create_payment",
  "stripe_cancel_payment",
  "stripe_capture_payment",
  // Subscriptions
  "stripe_list_subscriptions",
  "stripe_get_subscription",
  "stripe_create_subscription",
  "stripe_update_subscription",
  "stripe_cancel_subscription",
  // Invoices
  "stripe_list_invoices",
  "stripe_get_invoice",
  "stripe_create_invoice",
  "stripe_finalize_invoice",
  "stripe_pay_invoice",
  "stripe_void_invoice",
  // Products
  "stripe_list_products",
  "stripe_get_product",
  "stripe_create_product",
  // Prices
  "stripe_list_prices",
  "stripe_get_price",
  "stripe_create_price",
  // Refunds
  "stripe_list_refunds",
  "stripe_get_refund",
  "stripe_create_refund",
  // Balance
  "stripe_get_balance",
  // Events
  "stripe_list_events",
  "stripe_get_event",
  // Payment Methods
  "stripe_list_payment_methods",
] as const;


export function stripeIntegration(config: StripeIntegrationConfig = {}): MCPIntegration<"stripe"> {
  const oauth: OAuthConfig = {
    provider: "stripe",
    clientId: config.clientId ?? getEnv('STRIPE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('STRIPE_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "stripe",
    name: "Stripe",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/stripe.jpeg",
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
