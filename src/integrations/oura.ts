import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Oura");

const OURA_SCOPES = [
  "email",
  "personal",
  "daily",
  "heartrate",
  "workout",
  "session",
  "tag",
] as const;

const OURA_TOOLS = [
  "oura_get_personal_info",
  "oura_list_daily_activity",
  "oura_list_sleep",
  "oura_list_workouts",
  "oura_list_sessions",
  "oura_list_tags",
] as const;

export interface OuraIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function ouraIntegration(config: OuraIntegrationConfig = {}): MCPIntegration<"oura"> {
  const oauth: OAuthConfig = { provider: "oura", clientId: config.clientId ?? getEnv("OURA_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("OURA_CLIENT_SECRET"), scopes: config.scopes ?? [...OURA_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "oura", name: "Oura", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/oura.png", description: "Manage Oura get personal info, list daily activity, list sleep, list workouts, list sessions", category: "Fitness", tools: [...OURA_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Oura integration initialized"); },
    async onAfterConnect() { logger.debug("Oura integration connected"); },
  };
}

export type OuraTools = (typeof OURA_TOOLS)[number];
export type OuraScopes = (typeof OURA_SCOPES)[number];
export type { OuraIntegrationClient } from "./oura-client.js";
