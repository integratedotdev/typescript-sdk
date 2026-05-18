import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Ads");

const GOOGLE_ADS_SCOPES = [
  "https://www.googleapis.com/auth/adwords",
] as const;

const GOOGLE_ADS_TOOLS = [
  "google_ads_list_accessible_customers",
  "google_ads_search",
  "google_ads_list_campaigns",
  "google_ads_list_ad_groups",
  "google_ads_list_ads",
  "google_ads_list_keywords",
  "google_ads_list_conversions",
] as const;

export interface GoogleAdsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  developerToken?: string;
  loginCustomerId?: string;
}

export function googleAdsIntegration(config: GoogleAdsIntegrationConfig = {}): MCPIntegration<"google_ads"> {
  const oauth: OAuthConfig = { provider: "google_ads", clientId: config.clientId ?? getEnv("GOOGLE_ADS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOOGLE_ADS_CLIENT_SECRET"), scopes: config.scopes ?? [...GOOGLE_ADS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "google_ads", name: "Google Ads", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_ads.png", description: "Manage Google Ads customers, campaigns, ad groups, ads, keywords, and conversions", category: "Marketing", tools: [...GOOGLE_ADS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const developerToken = config.developerToken ?? getEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
    const headers: Record<string, string> = {};
    if (developerToken) headers["X-Google-Ads-Developer-Token"] = developerToken;
    if (config.loginCustomerId) headers["X-Google-Ads-Login-Customer-Id"] = config.loginCustomerId;
    return headers;
    },
    async onInit() { logger.debug("Google Ads integration initialized"); },
    async onAfterConnect() { logger.debug("Google Ads integration connected"); },
  };
}

export type GoogleAdsTools = (typeof GOOGLE_ADS_TOOLS)[number];
export type GoogleAdsScopes = (typeof GOOGLE_ADS_SCOPES)[number];
export type { GoogleAdsIntegrationClient } from "./google_ads-client.js";
