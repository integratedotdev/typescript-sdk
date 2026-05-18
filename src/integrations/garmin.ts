import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Garmin");

const GARMIN_SCOPES = [
  "activities",
  "heartrate",
  "sleep",
  "stress",
  "body_composition",
  "user_metrics",
] as const;

const GARMIN_TOOLS = [
  "garmin_list_activities",
  "garmin_list_daily_summaries",
  "garmin_list_sleep",
  "garmin_list_heart_rates",
  "garmin_list_body_composition",
] as const;

export interface GarminIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function garminIntegration(config: GarminIntegrationConfig = {}): MCPIntegration<"garmin"> {
  const oauth: OAuthConfig = { provider: "garmin", clientId: config.clientId ?? getEnv("GARMIN_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GARMIN_CLIENT_SECRET"), scopes: config.scopes ?? [...GARMIN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "garmin", name: "Garmin", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/garmin.png", description: "Manage Garmin list activities, list daily summaries, list sleep, list heart rates, list body composition", category: "Fitness", tools: [...GARMIN_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Garmin integration initialized"); },
    async onAfterConnect() { logger.debug("Garmin integration connected"); },
  };
}

export type GarminTools = (typeof GARMIN_TOOLS)[number];
export type GarminScopes = (typeof GARMIN_SCOPES)[number];
export type { GarminIntegrationClient } from "./garmin-client.js";
