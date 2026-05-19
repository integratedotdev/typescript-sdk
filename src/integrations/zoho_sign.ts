import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Sign");

const ZOHO_SIGN_SCOPES = [
  "ZohoSign.documents.ALL",
  "ZohoSign.templates.READ",
  "ZohoSign.account.READ",
] as const;

const ZOHO_SIGN_TOOLS = [
  "zoho_sign_list_requests",
  "zoho_sign_get_request",
  "zoho_sign_create_request",
  "zoho_sign_list_templates",
  "zoho_sign_get_template",
  "zoho_sign_list_contacts",
] as const;

export interface ZohoSignIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoSignIntegration(config: ZohoSignIntegrationConfig = {}): MCPIntegration<"zoho_sign"> {
  const oauth: OAuthConfig = { provider: "zoho_sign", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_SIGN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_sign", name: "Zoho Sign", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_sign.png", description: "Manage Zoho Sign requests, templates, contacts, and signature workflows", category: "Legal", tools: [...ZOHO_SIGN_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Sign integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Sign integration connected"); },
  };
}

export type ZohoSignTools = (typeof ZOHO_SIGN_TOOLS)[number];
export type ZohoSignScopes = (typeof ZOHO_SIGN_SCOPES)[number];
export type { ZohoSignIntegrationClient } from "./zoho_sign-client.js";
