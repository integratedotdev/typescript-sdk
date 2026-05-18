import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Invoice");

const ZOHO_INVOICE_SCOPES = [
  "ZohoInvoice.fullaccess.all",
] as const;

const ZOHO_INVOICE_TOOLS = [
  "zoho_invoice_list_organizations",
  "zoho_invoice_list_contacts",
  "zoho_invoice_list_items",
  "zoho_invoice_list_estimates",
  "zoho_invoice_list_invoices",
  "zoho_invoice_list_customerpayments",
  "zoho_invoice_create_invoice",
  "zoho_invoice_get_aging_summary",
] as const;

export interface ZohoInvoiceIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoInvoiceIntegration(config: ZohoInvoiceIntegrationConfig = {}): MCPIntegration<"zoho_invoice"> {
  const oauth: OAuthConfig = { provider: "zoho_invoice", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_INVOICE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_invoice", name: "Zoho Invoice", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_invoice.png", description: "Manage Zoho Invoice organizations, customers, items, estimates, invoices, payments, and reports", category: "Business", tools: [...ZOHO_INVOICE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Invoice integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Invoice integration connected"); },
  };
}

export type ZohoInvoiceTools = (typeof ZOHO_INVOICE_TOOLS)[number];
export type ZohoInvoiceScopes = (typeof ZOHO_INVOICE_SCOPES)[number];
export type { ZohoInvoiceIntegrationClient } from "./zoho_invoice-client.js";
