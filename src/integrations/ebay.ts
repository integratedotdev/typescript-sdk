import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("eBay");

const EBAY_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  "https://api.ebay.com/oauth/api_scope/sell.account",
] as const;

const EBAY_TOOLS = [
  "ebay_search_items",
  "ebay_get_item",
  "ebay_get_privileges",
  "ebay_list_inventory_items",
  "ebay_create_or_replace_inventory_item",
  "ebay_list_offers",
  "ebay_create_offer",
  "ebay_list_orders",
  "ebay_get_order",
] as const;

export interface EbayIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  environment?: "production" | "sandbox";
}

export function ebayIntegration(config: EbayIntegrationConfig = {}): MCPIntegration<"ebay"> {
  const oauth: OAuthConfig = { provider: "ebay", clientId: config.clientId ?? getEnv("EBAY_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("EBAY_CLIENT_SECRET"), scopes: config.scopes ?? [...EBAY_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "ebay", name: "eBay", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/ebay.png", description: "Manage eBay browse, inventory, offers, orders, and fulfillment APIs", category: "Commerce", tools: [...EBAY_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const headers: Record<string, string> = {};
    if (config.environment) headers["X-Ebay-Environment"] = config.environment;
    return headers;
    },
    async onInit() { logger.debug("eBay integration initialized"); },
    async onAfterConnect() { logger.debug("eBay integration connected"); },
  };
}

export type EbayTools = (typeof EBAY_TOOLS)[number];
export type EbayScopes = (typeof EBAY_SCOPES)[number];
export type { EbayIntegrationClient } from "./ebay-client.js";
