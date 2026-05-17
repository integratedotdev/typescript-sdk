import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("QuickBooks");

const QUICKBOOKS_SCOPES = ["com.intuit.quickbooks.accounting", "openid", "profile", "email", "offline_access"] as const;

const QUICKBOOKS_TOOLS = [
  "quickbooks_get_company_info",
  "quickbooks_query",
  "quickbooks_list_customers",
  "quickbooks_get_customer",
  "quickbooks_create_customer",
  "quickbooks_list_vendors",
  "quickbooks_create_vendor",
  "quickbooks_list_items",
  "quickbooks_create_item",
  "quickbooks_list_accounts",
  "quickbooks_list_invoices",
  "quickbooks_get_invoice",
  "quickbooks_create_invoice",
  "quickbooks_list_bills",
  "quickbooks_create_bill",
  "quickbooks_create_payment",
  "quickbooks_get_report",
] as const;

export interface QuickBooksIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function quickbooksIntegration(config: QuickBooksIntegrationConfig = {}): MCPIntegration<"quickbooks"> {
  const oauth: OAuthConfig = {
    provider: "quickbooks",
    clientId: config.clientId ?? getEnv("QUICKBOOKS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("QUICKBOOKS_CLIENT_SECRET"),
    scopes: config.scopes ?? [...QUICKBOOKS_SCOPES],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "quickbooks",
    name: "QuickBooks Online",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/quickbooks.png",
    description: "Manage QuickBooks Online company data, customers, vendors, items, accounts, invoices, bills, payments, reports, and queries",
    category: "Finance",
    tools: [...QUICKBOOKS_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("QuickBooks integration initialized"); },
    async onAfterConnect() { logger.debug("QuickBooks integration connected"); },
  };
}

export type QuickBooksTools = (typeof QUICKBOOKS_TOOLS)[number];
export type QuickBooksScopes = (typeof QUICKBOOKS_SCOPES)[number];
export type { QuickBooksIntegrationClient } from "./quickbooks-client.js";

