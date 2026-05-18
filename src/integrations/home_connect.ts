import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Home Connect");

const HOME_CONNECT_SCOPES = [
  "IdentifyAppliance",
  "Monitor",
  "Settings",
  "Control",
] as const;

const HOME_CONNECT_TOOLS = [
  "home_connect_list_appliances",
  "home_connect_get_appliance",
  "home_connect_get_status",
  "home_connect_get_programs",
  "home_connect_start_program",
  "home_connect_set_setting",
] as const;

export interface HomeConnectIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function homeConnectIntegration(config: HomeConnectIntegrationConfig = {}): MCPIntegration<"home_connect"> {
  const oauth: OAuthConfig = { provider: "home_connect", clientId: config.clientId ?? getEnv("HOME_CONNECT_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("HOME_CONNECT_CLIENT_SECRET"), scopes: config.scopes ?? [...HOME_CONNECT_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "home_connect", name: "Home Connect", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/home_connect.png", description: "Manage Home Connect list appliances, get appliance, get status, get programs, start program", category: "Lifestyle", tools: [...HOME_CONNECT_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Home Connect integration initialized"); },
    async onAfterConnect() { logger.debug("Home Connect integration connected"); },
  };
}

export type HomeConnectTools = (typeof HOME_CONNECT_TOOLS)[number];
export type HomeConnectScopes = (typeof HOME_CONNECT_SCOPES)[number];
export type { HomeConnectIntegrationClient } from "./home_connect-client.js";
