import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("FreeAgent");

const FREEAGENT_SCOPES = [
  "full_access",
] as const;

const FREEAGENT_TOOLS = [
  "freeagent_get_company",
  "freeagent_list_contacts",
  "freeagent_create_contact",
  "freeagent_list_invoices",
  "freeagent_create_invoice",
  "freeagent_list_bills",
] as const;

export interface FreeagentIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function freeagentIntegration(config: FreeagentIntegrationConfig = {}): MCPIntegration<"freeagent"> {
  const oauth: OAuthConfig = { provider: "freeagent", clientId: config.clientId ?? getEnv("FREEAGENT_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FREEAGENT_CLIENT_SECRET"), scopes: config.scopes ?? [...FREEAGENT_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "freeagent", name: "FreeAgent", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/freeagent.png", description: "Manage FreeAgent get company, list contacts, create contact, list invoices, create invoice", category: "Accounting", tools: [...FREEAGENT_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("FreeAgent integration initialized"); },
    async onAfterConnect() { logger.debug("FreeAgent integration connected"); },
  };
}

export type FreeagentTools = (typeof FREEAGENT_TOOLS)[number];
export type FreeagentScopes = (typeof FREEAGENT_SCOPES)[number];
export type { FreeagentIntegrationClient } from "./freeagent-client.js";
