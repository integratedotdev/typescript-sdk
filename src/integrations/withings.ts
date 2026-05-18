import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Withings");

const WITHINGS_SCOPES = [
  "user.info",
  "user.metrics",
  "user.activity",
] as const;

const WITHINGS_TOOLS = [
  "withings_get_measurements",
  "withings_get_activity",
  "withings_get_sleep",
  "withings_get_workouts",
  "withings_get_user",
] as const;

export interface WithingsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function withingsIntegration(config: WithingsIntegrationConfig = {}): MCPIntegration<"withings"> {
  const oauth: OAuthConfig = { provider: "withings", clientId: config.clientId ?? getEnv("WITHINGS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("WITHINGS_CLIENT_SECRET"), scopes: config.scopes ?? [...WITHINGS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "withings", name: "Withings", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/withings.png", description: "Manage Withings get measurements, get activity, get sleep, get workouts, get user", category: "Fitness", tools: [...WITHINGS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Withings integration initialized"); },
    async onAfterConnect() { logger.debug("Withings integration connected"); },
  };
}

export type WithingsTools = (typeof WITHINGS_TOOLS)[number];
export type WithingsScopes = (typeof WITHINGS_SCOPES)[number];
export type { WithingsIntegrationClient } from "./withings-client.js";
