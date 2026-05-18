import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("WHOOP");

const WHOOP_SCOPES = [
  "read:profile",
  "read:cycles",
  "read:recovery",
  "read:sleep",
  "read:workout",
  "read:body_measurement",
] as const;

const WHOOP_TOOLS = [
  "whoop_get_profile",
  "whoop_get_body_measurement",
  "whoop_list_cycles",
  "whoop_list_recovery",
  "whoop_list_sleep",
  "whoop_list_workouts",
] as const;

export interface WhoopIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function whoopIntegration(config: WhoopIntegrationConfig = {}): MCPIntegration<"whoop"> {
  const oauth: OAuthConfig = { provider: "whoop", clientId: config.clientId ?? getEnv("WHOOP_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("WHOOP_CLIENT_SECRET"), scopes: config.scopes ?? [...WHOOP_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "whoop", name: "WHOOP", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/whoop.png", description: "Manage WHOOP get profile, get body measurement, list cycles, list recovery, list sleep", category: "Fitness", tools: [...WHOOP_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("WHOOP integration initialized"); },
    async onAfterConnect() { logger.debug("WHOOP integration connected"); },
  };
}

export type WhoopTools = (typeof WHOOP_TOOLS)[number];
export type WhoopScopes = (typeof WHOOP_SCOPES)[number];
export type { WhoopIntegrationClient } from "./whoop-client.js";
