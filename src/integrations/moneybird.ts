import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Moneybird");

const MONEYBIRD_SCOPES = [
  "sales_invoices",
  "documents",
  "estimates",
  "bank",
  "settings",
] as const;

const MONEYBIRD_TOOLS = [
  "moneybird_list_administrations",
  "moneybird_list_contacts",
  "moneybird_create_contact",
  "moneybird_list_sales_invoices",
  "moneybird_create_sales_invoice",
  "moneybird_list_financial_accounts",
] as const;

export interface MoneybirdIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function moneybirdIntegration(config: MoneybirdIntegrationConfig = {}): MCPIntegration<"moneybird"> {
  const oauth: OAuthConfig = { provider: "moneybird", clientId: config.clientId ?? getEnv("MONEYBIRD_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MONEYBIRD_CLIENT_SECRET"), scopes: config.scopes ?? [...MONEYBIRD_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "moneybird", name: "Moneybird", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/moneybird.png", description: "Manage Moneybird list administrations, list contacts, create contact, list sales invoices, create sales invoice", category: "Accounting", tools: [...MONEYBIRD_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Moneybird integration initialized"); },
    async onAfterConnect() { logger.debug("Moneybird integration connected"); },
  };
}

export type MoneybirdTools = (typeof MONEYBIRD_TOOLS)[number];
export type MoneybirdScopes = (typeof MONEYBIRD_SCOPES)[number];
export type { MoneybirdIntegrationClient } from "./moneybird-client.js";
