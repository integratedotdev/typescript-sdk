import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Amazon Ads");

const AMAZON_ADS_SCOPES = [
  "advertising::campaign_management",
] as const;

const AMAZON_ADS_TOOLS = [
  "amazon_ads_list_profiles",
  "amazon_ads_list_campaigns",
  "amazon_ads_create_campaigns",
  "amazon_ads_list_ad_groups",
  "amazon_ads_list_keywords",
  "amazon_ads_request_report",
] as const;

export interface AmazonAdsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function amazonAdsIntegration(config: AmazonAdsIntegrationConfig = {}): MCPIntegration<"amazon_ads"> {
  const oauth: OAuthConfig = { provider: "amazon_ads", clientId: config.clientId ?? getEnv("AMAZON_ADS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("AMAZON_ADS_CLIENT_SECRET"), scopes: config.scopes ?? [...AMAZON_ADS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "amazon_ads", name: "Amazon Ads", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/amazon_ads.png", description: "Manage Amazon Ads list profiles, list campaigns, create campaigns, list ad groups, list keywords", category: "Marketing", tools: [...AMAZON_ADS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Amazon Ads integration initialized"); },
    async onAfterConnect() { logger.debug("Amazon Ads integration connected"); },
  };
}

export type AmazonAdsTools = (typeof AMAZON_ADS_TOOLS)[number];
export type AmazonAdsScopes = (typeof AMAZON_ADS_SCOPES)[number];
export type { AmazonAdsIntegrationClient } from "./amazon_ads-client.js";
