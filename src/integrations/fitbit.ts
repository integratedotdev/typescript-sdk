import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Fitbit");

const FITBIT_SCOPES = [
  "activity",
  "heartrate",
  "location",
  "nutrition",
  "profile",
  "settings",
  "sleep",
  "social",
  "weight",
] as const;

const FITBIT_TOOLS = [
  "fitbit_get_profile",
  "fitbit_list_activities",
  "fitbit_list_sleep",
  "fitbit_list_heart_rate",
  "fitbit_list_weight",
  "fitbit_log_activity",
] as const;

export interface FitbitIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function fitbitIntegration(config: FitbitIntegrationConfig = {}): MCPIntegration<"fitbit"> {
  const oauth: OAuthConfig = { provider: "fitbit", clientId: config.clientId ?? getEnv("FITBIT_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FITBIT_CLIENT_SECRET"), scopes: config.scopes ?? [...FITBIT_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "fitbit", name: "Fitbit", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/fitbit.png", description: "Manage Fitbit get profile, list activities, list sleep, list heart rate, list weight", category: "Fitness", tools: [...FITBIT_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Fitbit integration initialized"); },
    async onAfterConnect() { logger.debug("Fitbit integration connected"); },
  };
}

export type FitbitTools = (typeof FITBIT_TOOLS)[number];
export type FitbitScopes = (typeof FITBIT_SCOPES)[number];
export type { FitbitIntegrationClient } from "./fitbit-client.js";
