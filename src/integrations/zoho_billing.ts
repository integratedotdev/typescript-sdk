import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Billing");

const ZOHO_BILLING_SCOPES = [
  "ZohoBilling.fullaccess.all",
] as const;

const ZOHO_BILLING_TOOLS = [
  "zoho_billing_list_organizations",
  "zoho_billing_list_customers",
  "zoho_billing_list_items",
  "zoho_billing_list_subscriptions",
  "zoho_billing_create_subscription",
  "zoho_billing_list_invoices",
] as const;

export interface ZohoBillingIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoBillingIntegration(config: ZohoBillingIntegrationConfig = {}): MCPIntegration<"zoho_billing"> {
  const oauth: OAuthConfig = { provider: "zoho_billing", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_BILLING_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_billing", name: "Zoho Billing", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_billing.png", description: "Manage Zoho Billing organizations, customers, items, subscriptions, and invoices", category: "Accounting", tools: [...ZOHO_BILLING_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Billing integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Billing integration connected"); },
  };
}

export type ZohoBillingTools = (typeof ZOHO_BILLING_TOOLS)[number];
export type ZohoBillingScopes = (typeof ZOHO_BILLING_SCOPES)[number];
export type { ZohoBillingIntegrationClient } from "./zoho_billing-client.js";
