import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Books");

const ZOHO_BOOKS_SCOPES = [
  "ZohoBooks.fullaccess.all",
] as const;

const ZOHO_BOOKS_TOOLS = [
  "zoho_books_list_organizations",
  "zoho_books_list_contacts",
  "zoho_books_list_items",
  "zoho_books_list_invoices",
  "zoho_books_list_bills",
  "zoho_books_list_customerpayments",
  "zoho_books_create_invoice",
  "zoho_books_profit_and_loss",
] as const;

export interface ZohoBooksIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoBooksIntegration(config: ZohoBooksIntegrationConfig = {}): MCPIntegration<"zoho_books"> {
  const oauth: OAuthConfig = { provider: "zoho_books", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_BOOKS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_books", name: "Zoho Books", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_books.png", description: "Manage Zoho Books organizations, contacts, items, invoices, bills, payments, and reports", category: "Accounting", tools: [...ZOHO_BOOKS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Books integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Books integration connected"); },
  };
}

export type ZohoBooksTools = (typeof ZOHO_BOOKS_TOOLS)[number];
export type ZohoBooksScopes = (typeof ZOHO_BOOKS_SCOPES)[number];
export type { ZohoBooksIntegrationClient } from "./zoho_books-client.js";
