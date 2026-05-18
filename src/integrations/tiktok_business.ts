import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("TikTok Business");

const TIKTOK_BUSINESS_SCOPES = [
  "user.info.basic",
  "advertiser.read",
  "campaign.read",
  "campaign.write",
  "adgroup.read",
  "adgroup.write",
  "ad.read",
  "ad.write",
  "report.read",
] as const;

const TIKTOK_BUSINESS_TOOLS = [
  "tiktok_business_list_advertisers",
  "tiktok_business_list_campaigns",
  "tiktok_business_create_campaign",
  "tiktok_business_list_adgroups",
  "tiktok_business_list_ads",
  "tiktok_business_run_report",
] as const;

export interface TiktokBusinessIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function tiktokBusinessIntegration(config: TiktokBusinessIntegrationConfig = {}): MCPIntegration<"tiktok_business"> {
  const oauth: OAuthConfig = { provider: "tiktok_business", clientId: config.clientId ?? getEnv("TIKTOK_BUSINESS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TIKTOK_BUSINESS_CLIENT_SECRET"), scopes: config.scopes ?? [...TIKTOK_BUSINESS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "tiktok_business", name: "TikTok Business", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tiktok_business.png", description: "Manage TikTok Business list advertisers, list campaigns, create campaign, list adgroups, list ads", category: "Marketing", tools: [...TIKTOK_BUSINESS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("TikTok Business integration initialized"); },
    async onAfterConnect() { logger.debug("TikTok Business integration connected"); },
  };
}

export type TiktokBusinessTools = (typeof TIKTOK_BUSINESS_TOOLS)[number];
export type TiktokBusinessScopes = (typeof TIKTOK_BUSINESS_SCOPES)[number];
export type { TiktokBusinessIntegrationClient } from "./tiktok_business-client.js";
