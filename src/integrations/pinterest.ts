import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Pinterest");

const PINTEREST_SCOPES = [
  "boards:read",
  "boards:write",
  "pins:read",
  "pins:write",
  "user_accounts:read",
  "ads:read",
  "ads:write",
] as const;

const PINTEREST_TOOLS = [
  "pinterest_get_user",
  "pinterest_list_boards",
  "pinterest_get_board",
  "pinterest_create_pin",
  "pinterest_get_pin",
  "pinterest_search_pins",
  "pinterest_list_ad_accounts",
  "pinterest_list_campaigns",
] as const;

export interface PinterestIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function pinterestIntegration(config: PinterestIntegrationConfig = {}): MCPIntegration<"pinterest"> {
  const oauth: OAuthConfig = { provider: "pinterest", clientId: config.clientId ?? getEnv("PINTEREST_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("PINTEREST_CLIENT_SECRET"), scopes: config.scopes ?? [...PINTEREST_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "pinterest", name: "Pinterest", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/pinterest.png", description: "Manage Pinterest boards, pins, search, ad accounts, and campaigns", category: "Social Media", tools: [...PINTEREST_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Pinterest integration initialized"); },
    async onAfterConnect() { logger.debug("Pinterest integration connected"); },
  };
}

export type PinterestTools = (typeof PINTEREST_TOOLS)[number];
export type PinterestScopes = (typeof PINTEREST_SCOPES)[number];
export type { PinterestIntegrationClient } from "./pinterest-client.js";
