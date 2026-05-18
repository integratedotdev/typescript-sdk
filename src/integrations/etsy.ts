import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Etsy");

const ETSY_SCOPES = [
  "listings_r",
  "listings_w",
  "transactions_r",
  "transactions_w",
  "shops_r",
  "shops_w",
  "profile_r",
] as const;

const ETSY_TOOLS = [
  "etsy_get_me",
  "etsy_get_shop",
  "etsy_list_shop_listings",
  "etsy_create_listing",
  "etsy_list_receipts",
  "etsy_update_inventory",
] as const;

export interface EtsyIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function etsyIntegration(config: EtsyIntegrationConfig = {}): MCPIntegration<"etsy"> {
  const oauth: OAuthConfig = { provider: "etsy", clientId: config.clientId ?? getEnv("ETSY_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ETSY_CLIENT_SECRET"), scopes: config.scopes ?? [...ETSY_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "etsy", name: "Etsy", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/etsy.png", description: "Manage Etsy get me, get shop, list shop listings, create listing, list receipts", category: "Commerce", tools: [...ETSY_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Etsy integration initialized"); },
    async onAfterConnect() { logger.debug("Etsy integration connected"); },
  };
}

export type EtsyTools = (typeof ETSY_TOOLS)[number];
export type EtsyScopes = (typeof ETSY_SCOPES)[number];
export type { EtsyIntegrationClient } from "./etsy-client.js";
