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
  /** Additional OAuth scopes (default includes read/write for products, subscriptions, customers, orders, benefits, license_keys, checkout_links, discounts, metrics, organizations) */
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
  // Products
  "polar_list_products",
  "polar_get_product",
  "polar_create_product",
  "polar_update_product",

  // Subscriptions
  "polar_list_subscriptions",
  "polar_get_subscription",
  "polar_update_subscription",
  "polar_revoke_subscription",

  // Customers
  "polar_list_customers",
  "polar_get_customer",
  "polar_create_customer",
  "polar_update_customer",
  "polar_delete_customer",
  "polar_get_customer_state",

  // Orders
  "polar_list_orders",
  "polar_get_order",
  "polar_get_order_invoice",

  // Benefits
  "polar_list_benefits",
  "polar_get_benefit",
  "polar_create_benefit",
  "polar_update_benefit",

  // Discounts
  "polar_list_discounts",
  "polar_get_discount",
  "polar_create_discount",
  "polar_delete_discount",

  // Checkout Links
  "polar_list_checkout_links",
  "polar_get_checkout_link",
  "polar_create_checkout_link",

  // License Keys
  "polar_list_license_keys",
  "polar_get_license_key",
  "polar_validate_license_key",
  "polar_activate_license_key",

  // Metrics
  "polar_get_metrics",

  // Organizations
  "polar_list_organizations",
  "polar_get_organization",
] as const;


export function polarIntegration(config: PolarIntegrationConfig = {}): MCPIntegration<"polar"> {
  const oauth: OAuthConfig = {
    provider: "polar",
    clientId: config.clientId ?? getEnv('POLAR_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('POLAR_CLIENT_SECRET'),
    scopes: config.scopes || [
      "openid",
      "products:read", "products:write",
      "subscriptions:read", "subscriptions:write",
      "customers:read", "customers:write",
      "orders:read",
      "benefits:read", "benefits:write",
      "license_keys:read", "license_keys:write",
      "checkout_links:read", "checkout_links:write",
      "discounts:read", "discounts:write",
      "metrics:read",
      "organizations:read",
    ],
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.polar.sh",
    },
  };

  return {
    id: "polar",
    name: "Polar",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/polar.png",
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
