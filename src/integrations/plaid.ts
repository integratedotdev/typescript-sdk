import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Plaid");

const PLAID_SCOPES = [
  "transactions",
  "auth",
  "identity",
  "accounts",
  "investments",
  "liabilities",
] as const;

const PLAID_TOOLS = [
  "plaid_create_link_token",
  "plaid_exchange_public_token",
  "plaid_get_accounts",
  "plaid_get_transactions",
  "plaid_get_identity",
  "plaid_get_investments",
] as const;

export interface PlaidIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function plaidIntegration(config: PlaidIntegrationConfig = {}): MCPIntegration<"plaid"> {
  const oauth: OAuthConfig = { provider: "plaid", clientId: config.clientId ?? getEnv("PLAID_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("PLAID_CLIENT_SECRET"), scopes: config.scopes ?? [...PLAID_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "plaid", name: "Plaid", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/plaid.png", description: "Manage Plaid create link token, exchange public token, get accounts, get transactions, get identity", category: "Banking", tools: [...PLAID_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Plaid integration initialized"); },
    async onAfterConnect() { logger.debug("Plaid integration connected"); },
  };
}

export type PlaidTools = (typeof PLAID_TOOLS)[number];
export type PlaidScopes = (typeof PLAID_SCOPES)[number];
export type { PlaidIntegrationClient } from "./plaid-client.js";
