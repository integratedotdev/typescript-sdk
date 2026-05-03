import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Shopify");

const SHOPIFY_SCOPES = [
  "read_products",
  "write_products",
  "read_orders",
  "write_orders",
  "read_customers",
  "write_customers",
  "read_inventory",
  "write_inventory",
  "read_content",
  "write_content",
  "read_fulfillments",
  "write_fulfillments",
  "read_analytics",
] as const;

const SHOPIFY_TOOLS = [
  "shopify_admin_graphql",
  "shopify_rest_get",
  "shopify_rest_post",
  "shopify_rest_put",
  "shopify_rest_delete",
  "shopify_get_shop",
] as const;

export interface ShopifyIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
  shop?: string;
}

export function shopifyIntegration(config: ShopifyIntegrationConfig = {}): MCPIntegration<"shopify"> {
  const oauth: OAuthConfig = {
    provider: "shopify",
    clientId: config.clientId ?? getEnv("SHOPIFY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SHOPIFY_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SHOPIFY_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://shopify.oauth.placeholder/admin/oauth/authorize",
      token_endpoint: "https://shopify.oauth.placeholder/admin/oauth/access_token",
      response_type: "code",
      grant_types_supported: ["authorization_code"],
      subdomain: config.shop ?? getEnv("SHOPIFY_SHOP"),
    },
  };

  return {
    id: "shopify",
    name: "Shopify",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/shopify.png",
    description: "Route-complete Shopify Admin access through GraphQL and REST tools",
    category: "Business",
    tools: [...SHOPIFY_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Shopify integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Shopify integration connected");
    },
  };
}

export type ShopifyTools = (typeof SHOPIFY_TOOLS)[number];
export type ShopifyScopes = (typeof SHOPIFY_SCOPES)[number];
export type { ShopifyIntegrationClient } from "./shopify-client.js";
