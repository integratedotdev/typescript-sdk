import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Campaigns");

const ZOHO_CAMPAIGNS_SCOPES = [
  "ZohoCampaigns.campaign.ALL",
  "ZohoCampaigns.contact.ALL",
  "ZohoCampaigns.report.READ",
] as const;

const ZOHO_CAMPAIGNS_TOOLS = [
  "zoho_campaigns_list_mailing_lists",
  "zoho_campaigns_list_contacts",
  "zoho_campaigns_add_contact",
  "zoho_campaigns_list_campaigns",
  "zoho_campaigns_get_campaign_report",
  "zoho_campaigns_send_campaign",
] as const;

export interface ZohoCampaignsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoCampaignsIntegration(config: ZohoCampaignsIntegrationConfig = {}): MCPIntegration<"zoho_campaigns"> {
  const oauth: OAuthConfig = { provider: "zoho_campaigns", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_CAMPAIGNS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_campaigns", name: "Zoho Campaigns", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_campaigns.png", description: "Manage Zoho Campaigns lists, contacts, campaigns, reports, and sends", category: "Business", tools: [...ZOHO_CAMPAIGNS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Campaigns integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Campaigns integration connected"); },
  };
}

export type ZohoCampaignsTools = (typeof ZOHO_CAMPAIGNS_TOOLS)[number];
export type ZohoCampaignsScopes = (typeof ZOHO_CAMPAIGNS_SCOPES)[number];
export type { ZohoCampaignsIntegrationClient } from "./zoho_campaigns-client.js";
