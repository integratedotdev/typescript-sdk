import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Amazon Selling Partner");

const AMAZON_SCOPES = [
  "sellingpartnerapi::notifications",
  "sellingpartnerapi::migration",
] as const;

const AMAZON_TOOLS = [
  "amazon_search_catalog_items",
  "amazon_list_orders",
  "amazon_get_order",
  "amazon_list_inventory",
  "amazon_list_listings",
  "amazon_patch_listing",
] as const;

export interface AmazonIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function amazonIntegration(config: AmazonIntegrationConfig = {}): MCPIntegration<"amazon"> {
  const oauth: OAuthConfig = { provider: "amazon", clientId: config.clientId ?? getEnv("AMAZON_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("AMAZON_CLIENT_SECRET"), scopes: config.scopes ?? [...AMAZON_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "amazon", name: "Amazon Selling Partner", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/amazon.png", description: "Manage Amazon Selling Partner search catalog items, list orders, get order, list inventory, list listings", category: "Commerce", tools: [...AMAZON_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Amazon Selling Partner integration initialized"); },
    async onAfterConnect() { logger.debug("Amazon Selling Partner integration connected"); },
  };
}

export type AmazonTools = (typeof AMAZON_TOOLS)[number];
export type AmazonScopes = (typeof AMAZON_SCOPES)[number];
export type { AmazonIntegrationClient } from "./amazon-client.js";
