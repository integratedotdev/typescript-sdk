import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("BigCommerce");

const BIGCOMMERCE_SCOPES = [
  "store_v2_products",
  "store_v2_orders",
  "store_v2_customers",
  "store_v2_information",
] as const;

const BIGCOMMERCE_TOOLS = [
  "bigcommerce_list_products",
  "bigcommerce_get_product",
  "bigcommerce_create_product",
  "bigcommerce_list_orders",
  "bigcommerce_get_order",
  "bigcommerce_list_customers",
] as const;

export interface BigcommerceIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  store_hash?: string;
}

export function bigcommerceIntegration(config: BigcommerceIntegrationConfig = {}): MCPIntegration<"bigcommerce"> {
  const oauth: OAuthConfig = { provider: "bigcommerce", clientId: config.clientId ?? getEnv("BIGCOMMERCE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("BIGCOMMERCE_CLIENT_SECRET"), scopes: config.scopes ?? [...BIGCOMMERCE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "bigcommerce", name: "BigCommerce", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/bigcommerce.png", description: "Manage BigCommerce list products, get product, create product, list orders, get order", category: "Commerce", tools: [...BIGCOMMERCE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.store_hash) headers["X-BigCommerce-Store-Hash"] = config.store_hash;
      return headers;
    },
    async onInit() { logger.debug("BigCommerce integration initialized"); },
    async onAfterConnect() { logger.debug("BigCommerce integration connected"); },
  };
}

export type BigcommerceTools = (typeof BIGCOMMERCE_TOOLS)[number];
export type BigcommerceScopes = (typeof BIGCOMMERCE_SCOPES)[number];
export type { BigcommerceIntegrationClient } from "./bigcommerce-client.js";
