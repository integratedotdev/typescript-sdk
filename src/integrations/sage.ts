import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Sage");

const SAGE_SCOPES = [
  "full_access",
] as const;

const SAGE_TOOLS = [
  "sage_get_business",
  "sage_list_contacts",
  "sage_create_contact",
  "sage_list_products",
  "sage_list_sales_invoices",
  "sage_create_sales_invoice",
] as const;

export interface SageIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function sageIntegration(config: SageIntegrationConfig = {}): MCPIntegration<"sage"> {
  const oauth: OAuthConfig = { provider: "sage", clientId: config.clientId ?? getEnv("SAGE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("SAGE_CLIENT_SECRET"), scopes: config.scopes ?? [...SAGE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "sage", name: "Sage", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/sage.png", description: "Manage Sage business details, contacts, products, and sales invoices", category: "Accounting", tools: [...SAGE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Sage integration initialized"); },
    async onAfterConnect() { logger.debug("Sage integration connected"); },
  };
}

export type SageTools = (typeof SAGE_TOOLS)[number];
export type SageScopes = (typeof SAGE_SCOPES)[number];
export type { SageIntegrationClient } from "./sage-client.js";
