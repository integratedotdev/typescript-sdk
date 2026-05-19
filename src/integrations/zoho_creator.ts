import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Creator");

const ZOHO_CREATOR_SCOPES = [
  "ZohoCreator.meta.READ",
  "ZohoCreator.data.READ",
  "ZohoCreator.data.CREATE",
  "ZohoCreator.data.UPDATE",
] as const;

const ZOHO_CREATOR_TOOLS = [
  "zoho_creator_list_applications",
  "zoho_creator_list_forms",
  "zoho_creator_list_reports",
  "zoho_creator_list_records",
  "zoho_creator_create_record",
  "zoho_creator_update_record",
] as const;

export interface ZohoCreatorIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoCreatorIntegration(config: ZohoCreatorIntegrationConfig = {}): MCPIntegration<"zoho_creator"> {
  const oauth: OAuthConfig = { provider: "zoho_creator", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_CREATOR_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_creator", name: "Zoho Creator", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_creator.png", description: "Manage Zoho Creator applications, forms, reports, and app records", category: "Business", tools: [...ZOHO_CREATOR_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Creator integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Creator integration connected"); },
  };
}

export type ZohoCreatorTools = (typeof ZOHO_CREATOR_TOOLS)[number];
export type ZohoCreatorScopes = (typeof ZOHO_CREATOR_SCOPES)[number];
export type { ZohoCreatorIntegrationClient } from "./zoho_creator-client.js";
