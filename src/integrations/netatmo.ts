import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Netatmo");

const NETATMO_SCOPES = [
  "read_station",
  "read_thermostat",
  "write_thermostat",
  "read_camera",
  "access_camera",
  "read_presence",
  "write_presence",
  "read_homecoach",
] as const;

const NETATMO_TOOLS = [
  "netatmo_get_homesdata",
  "netatmo_get_stationsdata",
  "netatmo_get_measure",
  "netatmo_set_thermpoint",
  "netatmo_get_events",
] as const;

export interface NetatmoIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function netatmoIntegration(config: NetatmoIntegrationConfig = {}): MCPIntegration<"netatmo"> {
  const oauth: OAuthConfig = { provider: "netatmo", clientId: config.clientId ?? getEnv("NETATMO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("NETATMO_CLIENT_SECRET"), scopes: config.scopes ?? [...NETATMO_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "netatmo", name: "Netatmo", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/netatmo.png", description: "Manage Netatmo get homesdata, get stationsdata, get measure, set thermpoint, get events", category: "Lifestyle", tools: [...NETATMO_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Netatmo integration initialized"); },
    async onAfterConnect() { logger.debug("Netatmo integration connected"); },
  };
}

export type NetatmoTools = (typeof NETATMO_TOOLS)[number];
export type NetatmoScopes = (typeof NETATMO_SCOPES)[number];
export type { NetatmoIntegrationClient } from "./netatmo-client.js";
