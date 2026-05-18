import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Analytics");

const ZOHO_ANALYTICS_SCOPES = [
  "ZohoAnalytics.fullaccess.all",
] as const;

const ZOHO_ANALYTICS_TOOLS = [
  "zoho_analytics_list_workspaces",
  "zoho_analytics_get_workspace",
  "zoho_analytics_list_views",
  "zoho_analytics_export_view",
  "zoho_analytics_import_data",
  "zoho_analytics_query",
] as const;

export interface ZohoAnalyticsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoAnalyticsIntegration(config: ZohoAnalyticsIntegrationConfig = {}): MCPIntegration<"zoho_analytics"> {
  const oauth: OAuthConfig = { provider: "zoho_analytics", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_ANALYTICS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_analytics", name: "Zoho Analytics", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_analytics.png", description: "Manage Zoho Analytics workspaces, views, imports, exports, and query APIs", category: "Business", tools: [...ZOHO_ANALYTICS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Analytics integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Analytics integration connected"); },
  };
}

export type ZohoAnalyticsTools = (typeof ZOHO_ANALYTICS_TOOLS)[number];
export type ZohoAnalyticsScopes = (typeof ZOHO_ANALYTICS_SCOPES)[number];
export type { ZohoAnalyticsIntegrationClient } from "./zoho_analytics-client.js";
