import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Ring");

const RING_SCOPES = [
  "openid",
  "profile",
  "offline_access",
] as const;

const RING_TOOLS = [
  "ring_list_locations",
  "ring_list_devices",
  "ring_get_device_health",
  "ring_list_events",
  "ring_activate_siren",
] as const;

export interface RingIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function ringIntegration(config: RingIntegrationConfig = {}): MCPIntegration<"ring"> {
  const oauth: OAuthConfig = { provider: "ring", clientId: config.clientId ?? getEnv("RING_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("RING_CLIENT_SECRET"), scopes: config.scopes ?? [...RING_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "ring", name: "Ring", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/ring.png", description: "Manage Ring list locations, list devices, get device health, list events, activate siren", category: "Lifestyle", tools: [...RING_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Ring integration initialized"); },
    async onAfterConnect() { logger.debug("Ring integration connected"); },
  };
}

export type RingTools = (typeof RING_TOOLS)[number];
export type RingScopes = (typeof RING_SCOPES)[number];
export type { RingIntegrationClient } from "./ring-client.js";
