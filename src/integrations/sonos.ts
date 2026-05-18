import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Sonos");

const SONOS_SCOPES = [
  "playback-control-all",
] as const;

const SONOS_TOOLS = [
  "sonos_list_households",
  "sonos_list_groups",
  "sonos_get_playback_status",
  "sonos_control_playback",
  "sonos_get_group_volume",
  "sonos_set_group_volume",
] as const;

export interface SonosIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function sonosIntegration(config: SonosIntegrationConfig = {}): MCPIntegration<"sonos"> {
  const oauth: OAuthConfig = { provider: "sonos", clientId: config.clientId ?? getEnv("SONOS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("SONOS_CLIENT_SECRET"), scopes: config.scopes ?? [...SONOS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "sonos", name: "Sonos", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/sonos.png", description: "Manage Sonos list households, list groups, get playback status, control playback, get group volume", category: "Lifestyle", tools: [...SONOS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Sonos integration initialized"); },
    async onAfterConnect() { logger.debug("Sonos integration connected"); },
  };
}

export type SonosTools = (typeof SONOS_TOOLS)[number];
export type SonosScopes = (typeof SONOS_SCOPES)[number];
export type { SonosIntegrationClient } from "./sonos-client.js";
