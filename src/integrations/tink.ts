import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Tink");

const TINK_SCOPES = [
  "accounts:read",
  "transactions:read",
  "user:read",
  "credentials:read",
] as const;

const TINK_TOOLS = [
  "tink_get_user",
  "tink_list_accounts",
  "tink_get_account",
  "tink_list_transactions",
  "tink_list_credentials",
  "tink_refresh_credentials",
] as const;

export interface TinkIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function tinkIntegration(config: TinkIntegrationConfig = {}): MCPIntegration<"tink"> {
  const oauth: OAuthConfig = { provider: "tink", clientId: config.clientId ?? getEnv("TINK_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TINK_CLIENT_SECRET"), scopes: config.scopes ?? [...TINK_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "tink", name: "Tink", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tink.png", description: "Manage Tink get user, list accounts, get account, list transactions, list credentials", category: "Banking", tools: [...TINK_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Tink integration initialized"); },
    async onAfterConnect() { logger.debug("Tink integration connected"); },
  };
}

export type TinkTools = (typeof TINK_TOOLS)[number];
export type TinkScopes = (typeof TINK_SCOPES)[number];
export type { TinkIntegrationClient } from "./tink-client.js";
