import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Meta Ads");

const META_ADS_SCOPES = [
  "ads_read",
  "ads_management",
  "business_management",
] as const;

const META_ADS_TOOLS = [
  "meta_ads_list_ad_accounts",
  "meta_ads_get_ad_account",
  "meta_ads_list_campaigns",
  "meta_ads_create_campaign",
  "meta_ads_list_adsets",
  "meta_ads_list_ads",
] as const;

export interface MetaAdsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function metaAdsIntegration(config: MetaAdsIntegrationConfig = {}): MCPIntegration<"meta_ads"> {
  const oauth: OAuthConfig = { provider: "meta_ads", clientId: config.clientId ?? getEnv("META_ADS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("META_ADS_CLIENT_SECRET"), scopes: config.scopes ?? [...META_ADS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "meta_ads", name: "Meta Ads", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/meta_ads.png", description: "Manage Meta Ads list ad accounts, get ad account, list campaigns, create campaign, list adsets", category: "Marketing", tools: [...META_ADS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Meta Ads integration initialized"); },
    async onAfterConnect() { logger.debug("Meta Ads integration connected"); },
  };
}

export type MetaAdsTools = (typeof META_ADS_TOOLS)[number];
export type MetaAdsScopes = (typeof META_ADS_SCOPES)[number];
export type { MetaAdsIntegrationClient } from "./meta_ads-client.js";
