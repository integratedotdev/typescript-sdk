import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Tuya");

const TUYA_SCOPES = [
  "device:read",
  "device:write",
  "home:read",
  "scene:read",
  "scene:write",
] as const;

const TUYA_TOOLS = [
  "tuya_list_devices",
  "tuya_get_device",
  "tuya_get_device_status",
  "tuya_send_device_commands",
  "tuya_list_scenes",
] as const;

export interface TuyaIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function tuyaIntegration(config: TuyaIntegrationConfig = {}): MCPIntegration<"tuya"> {
  const oauth: OAuthConfig = { provider: "tuya", clientId: config.clientId ?? getEnv("TUYA_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TUYA_CLIENT_SECRET"), scopes: config.scopes ?? [...TUYA_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "tuya", name: "Tuya", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tuya.png", description: "Manage Tuya list devices, get device, get device status, send device commands, list scenes", category: "Lifestyle", tools: [...TUYA_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Tuya integration initialized"); },
    async onAfterConnect() { logger.debug("Tuya integration connected"); },
  };
}

export type TuyaTools = (typeof TUYA_TOOLS)[number];
export type TuyaScopes = (typeof TUYA_SCOPES)[number];
export type { TuyaIntegrationClient } from "./tuya-client.js";
