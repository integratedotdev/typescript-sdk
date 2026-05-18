import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Tesla");

const TESLA_SCOPES = [
  "openid",
  "offline_access",
  "vehicle_device_data",
  "vehicle_cmds",
  "energy_device_data",
  "energy_cmds",
] as const;

const TESLA_TOOLS = [
  "tesla_list_vehicles",
  "tesla_get_vehicle",
  "tesla_wake_vehicle",
  "tesla_send_vehicle_command",
  "tesla_list_energy_sites",
] as const;

export interface TeslaIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function teslaIntegration(config: TeslaIntegrationConfig = {}): MCPIntegration<"tesla"> {
  const oauth: OAuthConfig = { provider: "tesla", clientId: config.clientId ?? getEnv("TESLA_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TESLA_CLIENT_SECRET"), scopes: config.scopes ?? [...TESLA_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "tesla", name: "Tesla", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tesla.png", description: "Manage Tesla list vehicles, get vehicle, wake vehicle, send vehicle command, list energy sites", category: "Lifestyle", tools: [...TESLA_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Tesla integration initialized"); },
    async onAfterConnect() { logger.debug("Tesla integration connected"); },
  };
}

export type TeslaTools = (typeof TESLA_TOOLS)[number];
export type TeslaScopes = (typeof TESLA_SCOPES)[number];
export type { TeslaIntegrationClient } from "./tesla-client.js";
