import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("SmartThings");

const SMARTTHINGS_SCOPES = [
  "r:locations:*",
  "x:locations:*",
  "r:devices:*",
  "x:devices:*",
  "r:scenes:*",
  "x:scenes:*",
  "r:rules:*",
  "x:rules:*",
] as const;

const SMARTTHINGS_TOOLS = [
  "smartthings_list_locations",
  "smartthings_get_location",
  "smartthings_list_rooms",
  "smartthings_get_room",
  "smartthings_list_devices",
  "smartthings_get_device",
  "smartthings_get_device_status",
  "smartthings_execute_device_command",
  "smartthings_list_scenes",
  "smartthings_execute_scene",
  "smartthings_list_rules",
  "smartthings_get_rule",
  "smartthings_create_rule",
  "smartthings_update_rule",
  "smartthings_delete_rule",
] as const;

export interface SmartThingsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function smartthingsIntegration(config: SmartThingsIntegrationConfig = {}): MCPIntegration<"smartthings"> {
  const accessToken = config.accessToken ?? getEnv("SMARTTHINGS_ACCESS_TOKEN");
  const oauth: OAuthConfig = {
    provider: "smartthings",
    clientId: config.clientId ?? getEnv("SMARTTHINGS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SMARTTHINGS_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SMARTTHINGS_SCOPES],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "smartthings",
    name: "Samsung SmartThings",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/smartthings.png",
    description: "Manage SmartThings locations, rooms, devices, commands, scenes, and rules",
    category: "Other",
    tools: [...SMARTTHINGS_TOOLS],
    authType: accessToken ? "apiKey" : "oauth",
    oauth,
    getHeaders: () => {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      return headers;
    },
    async onInit() { logger.debug("SmartThings integration initialized"); },
    async onAfterConnect() { logger.debug("SmartThings integration connected"); },
  };
}

export type SmartThingsTools = (typeof SMARTTHINGS_TOOLS)[number];
export type SmartThingsScopes = (typeof SMARTTHINGS_SCOPES)[number];
export type { SmartThingsIntegrationClient } from "./smartthings-client.js";
