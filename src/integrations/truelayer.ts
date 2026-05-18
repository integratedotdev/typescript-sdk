import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("TrueLayer");

const TRUELAYER_SCOPES = [
  "info",
  "accounts",
  "balance",
  "cards",
  "transactions",
  "direct_debits",
  "standing_orders",
  "offline_access",
] as const;

const TRUELAYER_TOOLS = [
  "truelayer_get_me",
  "truelayer_list_accounts",
  "truelayer_get_account",
  "truelayer_get_balance",
  "truelayer_list_transactions",
  "truelayer_list_cards",
] as const;

export interface TruelayerIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function truelayerIntegration(config: TruelayerIntegrationConfig = {}): MCPIntegration<"truelayer"> {
  const oauth: OAuthConfig = { provider: "truelayer", clientId: config.clientId ?? getEnv("TRUELAYER_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TRUELAYER_CLIENT_SECRET"), scopes: config.scopes ?? [...TRUELAYER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "truelayer", name: "TrueLayer", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/truelayer.png", description: "Manage TrueLayer get me, list accounts, get account, get balance, list transactions", category: "Banking", tools: [...TRUELAYER_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("TrueLayer integration initialized"); },
    async onAfterConnect() { logger.debug("TrueLayer integration connected"); },
  };
}

export type TruelayerTools = (typeof TRUELAYER_TOOLS)[number];
export type TruelayerScopes = (typeof TRUELAYER_SCOPES)[number];
export type { TruelayerIntegrationClient } from "./truelayer-client.js";
