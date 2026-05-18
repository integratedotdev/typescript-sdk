import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("OneLogin");

const ONELOGIN_SCOPES = [
  "openid",
  "profile",
  "manage:all",
] as const;

const ONELOGIN_TOOLS = [
  "onelogin_list_users",
  "onelogin_get_user",
  "onelogin_create_user",
  "onelogin_list_roles",
  "onelogin_list_apps",
  "onelogin_list_events",
] as const;

export interface OneloginIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function oneloginIntegration(config: OneloginIntegrationConfig = {}): MCPIntegration<"onelogin"> {
  const oauth: OAuthConfig = { provider: "onelogin", clientId: config.clientId ?? getEnv("ONELOGIN_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ONELOGIN_CLIENT_SECRET"), scopes: config.scopes ?? [...ONELOGIN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "onelogin", name: "OneLogin", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/onelogin.png", description: "Manage OneLogin list users, get user, create user, list roles, list apps", category: "Identity & Access", tools: [...ONELOGIN_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.region) headers["X-OneLogin-Region"] = config.region;
      return headers;
    },
    async onInit() { logger.debug("OneLogin integration initialized"); },
    async onAfterConnect() { logger.debug("OneLogin integration connected"); },
  };
}

export type OneloginTools = (typeof ONELOGIN_TOOLS)[number];
export type OneloginScopes = (typeof ONELOGIN_SCOPES)[number];
export type { OneloginIntegrationClient } from "./onelogin-client.js";
