import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Desk");

const ZOHO_DESK_SCOPES = [
  "Desk.tickets.ALL",
  "Desk.contacts.ALL",
  "Desk.settings.READ",
] as const;

const ZOHO_DESK_TOOLS = [
  "zoho_desk_list_tickets",
  "zoho_desk_get_ticket",
  "zoho_desk_create_ticket",
  "zoho_desk_list_contacts",
  "zoho_desk_list_accounts",
  "zoho_desk_list_agents",
  "zoho_desk_list_departments",
  "zoho_desk_search_articles",
] as const;

export interface ZohoDeskIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoDeskIntegration(config: ZohoDeskIntegrationConfig = {}): MCPIntegration<"zoho_desk"> {
  const oauth: OAuthConfig = { provider: "zoho_desk", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_DESK_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_desk", name: "Zoho Desk", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_desk.png", description: "Manage Zoho Desk tickets, contacts, accounts, agents, departments, and articles", category: "Business", tools: [...ZOHO_DESK_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Desk integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Desk integration connected"); },
  };
}

export type ZohoDeskTools = (typeof ZOHO_DESK_TOOLS)[number];
export type ZohoDeskScopes = (typeof ZOHO_DESK_SCOPES)[number];
export type { ZohoDeskIntegrationClient } from "./zoho_desk-client.js";
