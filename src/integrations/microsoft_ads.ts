import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Microsoft Ads");

const MICROSOFT_ADS_SCOPES = [
  "https://ads.microsoft.com/msads.manage",
  "offline_access",
] as const;

const MICROSOFT_ADS_TOOLS = [
  "microsoft_ads_get_user",
  "microsoft_ads_search_accounts",
  "microsoft_ads_get_campaigns",
  "microsoft_ads_add_campaigns",
  "microsoft_ads_get_ad_groups",
  "microsoft_ads_get_keywords",
] as const;

export interface MicrosoftAdsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function microsoftAdsIntegration(config: MicrosoftAdsIntegrationConfig = {}): MCPIntegration<"microsoft_ads"> {
  const oauth: OAuthConfig = { provider: "microsoft_ads", clientId: config.clientId ?? getEnv("MICROSOFT_ADS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MICROSOFT_ADS_CLIENT_SECRET"), scopes: config.scopes ?? [...MICROSOFT_ADS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "microsoft_ads", name: "Microsoft Ads", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/microsoft_ads.png", description: "Manage Microsoft Ads get user, search accounts, get campaigns, add campaigns, get ad groups", category: "Marketing", tools: [...MICROSOFT_ADS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Microsoft Ads integration initialized"); },
    async onAfterConnect() { logger.debug("Microsoft Ads integration connected"); },
  };
}

export type MicrosoftAdsTools = (typeof MICROSOFT_ADS_TOOLS)[number];
export type MicrosoftAdsScopes = (typeof MICROSOFT_ADS_SCOPES)[number];
export type { MicrosoftAdsIntegrationClient } from "./microsoft_ads-client.js";
