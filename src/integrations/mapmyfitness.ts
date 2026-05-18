import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("MapMyFitness");

const MAPMYFITNESS_SCOPES = [
  "read",
  "write",
] as const;

const MAPMYFITNESS_TOOLS = [
  "mapmyfitness_get_user",
  "mapmyfitness_list_workouts",
  "mapmyfitness_get_workout",
  "mapmyfitness_create_workout",
  "mapmyfitness_list_routes",
] as const;

export interface MapmyfitnessIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function mapmyfitnessIntegration(config: MapmyfitnessIntegrationConfig = {}): MCPIntegration<"mapmyfitness"> {
  const oauth: OAuthConfig = { provider: "mapmyfitness", clientId: config.clientId ?? getEnv("MAPMYFITNESS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MAPMYFITNESS_CLIENT_SECRET"), scopes: config.scopes ?? [...MAPMYFITNESS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "mapmyfitness", name: "MapMyFitness", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/mapmyfitness.png", description: "Manage MapMyFitness get user, list workouts, get workout, create workout, list routes", category: "Fitness", tools: [...MAPMYFITNESS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("MapMyFitness integration initialized"); },
    async onAfterConnect() { logger.debug("MapMyFitness integration connected"); },
  };
}

export type MapmyfitnessTools = (typeof MAPMYFITNESS_TOOLS)[number];
export type MapmyfitnessScopes = (typeof MAPMYFITNESS_SCOPES)[number];
export type { MapmyfitnessIntegrationClient } from "./mapmyfitness-client.js";
