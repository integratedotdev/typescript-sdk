import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Home/Nest");

const GOOGLE_HOME_SCOPES = [
  "https://www.googleapis.com/auth/sdm.service",
] as const;

const GOOGLE_HOME_TOOLS = [
  "google_home_list_devices",
  "google_home_get_device",
  "google_home_execute_device_command",
  "google_home_list_structures",
  "google_home_list_rooms",
] as const;

export interface GoogleHomeIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function googleHomeIntegration(config: GoogleHomeIntegrationConfig = {}): MCPIntegration<"google_home"> {
  const oauth: OAuthConfig = { provider: "google_home", clientId: config.clientId ?? getEnv("GOOGLE_HOME_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOOGLE_HOME_CLIENT_SECRET"), scopes: config.scopes ?? [...GOOGLE_HOME_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "google_home", name: "Google Home/Nest", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_home.png", description: "Manage Google Home/Nest list devices, get device, execute device command, list structures, list rooms", category: "Lifestyle", tools: [...GOOGLE_HOME_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Google Home/Nest integration initialized"); },
    async onAfterConnect() { logger.debug("Google Home/Nest integration connected"); },
  };
}

export type GoogleHomeTools = (typeof GOOGLE_HOME_TOOLS)[number];
export type GoogleHomeScopes = (typeof GOOGLE_HOME_SCOPES)[number];
export type { GoogleHomeIntegrationClient } from "./google_home-client.js";
