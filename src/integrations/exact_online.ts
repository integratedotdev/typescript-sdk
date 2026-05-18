import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Exact Online");

const EXACT_ONLINE_SCOPES = [
  "financial",
  "crm",
  "sales",
  "purchase",
  "offline_access",
] as const;

const EXACT_ONLINE_TOOLS = [
  "exact_online_list_divisions",
  "exact_online_list_accounts",
  "exact_online_list_items",
  "exact_online_list_sales_invoices",
  "exact_online_create_sales_invoice",
  "exact_online_list_gl_accounts",
] as const;

export interface ExactOnlineIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function exactOnlineIntegration(config: ExactOnlineIntegrationConfig = {}): MCPIntegration<"exact_online"> {
  const oauth: OAuthConfig = { provider: "exact_online", clientId: config.clientId ?? getEnv("EXACT_ONLINE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("EXACT_ONLINE_CLIENT_SECRET"), scopes: config.scopes ?? [...EXACT_ONLINE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "exact_online", name: "Exact Online", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/exact_online.png", description: "Manage Exact Online list divisions, list accounts, list items, list sales invoices, create sales invoice", category: "Accounting", tools: [...EXACT_ONLINE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Exact Online integration initialized"); },
    async onAfterConnect() { logger.debug("Exact Online integration connected"); },
  };
}

export type ExactOnlineTools = (typeof EXACT_ONLINE_TOOLS)[number];
export type ExactOnlineScopes = (typeof EXACT_ONLINE_SCOPES)[number];
export type { ExactOnlineIntegrationClient } from "./exact_online-client.js";
