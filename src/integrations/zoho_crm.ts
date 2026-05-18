import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho CRM");

const ZOHO_CRM_SCOPES = [
  "ZohoCRM.modules.ALL",
  "ZohoCRM.settings.ALL",
  "ZohoCRM.users.ALL",
] as const;

const ZOHO_CRM_TOOLS = [
  "zoho_crm_list_modules",
  "zoho_crm_list_records",
  "zoho_crm_get_record",
  "zoho_crm_create_records",
  "zoho_crm_update_record",
  "zoho_crm_search_records",
  "zoho_crm_coql_query",
  "zoho_crm_list_users",
  "zoho_crm_get_org",
] as const;

export interface ZohoCrmIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoCrmIntegration(config: ZohoCrmIntegrationConfig = {}): MCPIntegration<"zoho_crm"> {
  const oauth: OAuthConfig = { provider: "zoho_crm", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_CRM_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_crm", name: "Zoho CRM", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_crm.png", description: "Manage Zoho CRM modules, records, users, org settings, search, and COQL", category: "Business", tools: [...ZOHO_CRM_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho CRM integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho CRM integration connected"); },
  };
}

export type ZohoCrmTools = (typeof ZOHO_CRM_TOOLS)[number];
export type ZohoCrmScopes = (typeof ZOHO_CRM_SCOPES)[number];
export type { ZohoCrmIntegrationClient } from "./zoho_crm-client.js";
