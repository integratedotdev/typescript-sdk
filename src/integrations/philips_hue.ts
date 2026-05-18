import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Philips Hue");

const PHILIPS_HUE_SCOPES = [
  "remote_control:all",
] as const;

const PHILIPS_HUE_TOOLS = [
  "philips_hue_list_bridges",
  "philips_hue_list_lights",
  "philips_hue_get_light",
  "philips_hue_update_light",
  "philips_hue_list_rooms",
  "philips_hue_list_scenes",
] as const;

export interface PhilipsHueIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function philipsHueIntegration(config: PhilipsHueIntegrationConfig = {}): MCPIntegration<"philips_hue"> {
  const oauth: OAuthConfig = { provider: "philips_hue", clientId: config.clientId ?? getEnv("PHILIPS_HUE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("PHILIPS_HUE_CLIENT_SECRET"), scopes: config.scopes ?? [...PHILIPS_HUE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "philips_hue", name: "Philips Hue", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/philips_hue.png", description: "Manage Philips Hue list bridges, list lights, get light, update light, list rooms", category: "Lifestyle", tools: [...PHILIPS_HUE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Philips Hue integration initialized"); },
    async onAfterConnect() { logger.debug("Philips Hue integration connected"); },
  };
}

export type PhilipsHueTools = (typeof PHILIPS_HUE_TOOLS)[number];
export type PhilipsHueScopes = (typeof PHILIPS_HUE_SCOPES)[number];
export type { PhilipsHueIntegrationClient } from "./philips_hue-client.js";
