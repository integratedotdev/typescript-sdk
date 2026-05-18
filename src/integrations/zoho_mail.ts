import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Mail");

const ZOHO_MAIL_SCOPES = [
  "ZohoMail.accounts.READ",
  "ZohoMail.messages.ALL",
  "ZohoMail.folders.ALL",
] as const;

const ZOHO_MAIL_TOOLS = [
  "zoho_mail_list_accounts",
  "zoho_mail_list_folders",
  "zoho_mail_list_messages",
  "zoho_mail_get_message",
  "zoho_mail_send_message",
  "zoho_mail_search_messages",
  "zoho_mail_list_labels",
] as const;

export interface ZohoMailIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoMailIntegration(config: ZohoMailIntegrationConfig = {}): MCPIntegration<"zoho_mail"> {
  const oauth: OAuthConfig = { provider: "zoho_mail", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_MAIL_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_mail", name: "Zoho Mail", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_mail.png", description: "Manage Zoho Mail accounts, folders, messages, labels, search, and sending", category: "Business", tools: [...ZOHO_MAIL_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Mail integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Mail integration connected"); },
  };
}

export type ZohoMailTools = (typeof ZOHO_MAIL_TOOLS)[number];
export type ZohoMailScopes = (typeof ZOHO_MAIL_SCOPES)[number];
export type { ZohoMailIntegrationClient } from "./zoho_mail-client.js";
