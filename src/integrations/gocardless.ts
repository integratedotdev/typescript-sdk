import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("GoCardless");

const GOCARDLESS_SCOPES = [
  "openid",
  "accounts",
  "transactions",
  "balances",
] as const;

const GOCARDLESS_TOOLS = [
  "gocardless_list_institutions",
  "gocardless_create_requisition",
  "gocardless_get_requisition",
  "gocardless_get_account",
  "gocardless_get_balances",
  "gocardless_get_transactions",
] as const;

export interface GocardlessIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function gocardlessIntegration(config: GocardlessIntegrationConfig = {}): MCPIntegration<"gocardless"> {
  const oauth: OAuthConfig = { provider: "gocardless", clientId: config.clientId ?? getEnv("GOCARDLESS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOCARDLESS_CLIENT_SECRET"), scopes: config.scopes ?? [...GOCARDLESS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "gocardless", name: "GoCardless", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/gocardless.png", description: "Manage GoCardless institutions, requisitions, accounts, balances, and transactions", category: "Banking", tools: [...GOCARDLESS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("GoCardless integration initialized"); },
    async onAfterConnect() { logger.debug("GoCardless integration connected"); },
  };
}

export type GocardlessTools = (typeof GOCARDLESS_TOOLS)[number];
export type GocardlessScopes = (typeof GOCARDLESS_SCOPES)[number];
export type { GocardlessIntegrationClient } from "./gocardless-client.js";
