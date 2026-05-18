import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Miele");

const MIELE_SCOPES = [
  "openid",
  "offline_access",
  "read",
  "write",
] as const;

const MIELE_TOOLS = [
  "miele_list_devices",
  "miele_get_device",
  "miele_get_actions",
  "miele_execute_action",
  "miele_get_programs",
] as const;

export interface MieleIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function mieleIntegration(config: MieleIntegrationConfig = {}): MCPIntegration<"miele"> {
  const oauth: OAuthConfig = { provider: "miele", clientId: config.clientId ?? getEnv("MIELE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MIELE_CLIENT_SECRET"), scopes: config.scopes ?? [...MIELE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "miele", name: "Miele", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/miele.png", description: "Manage Miele list devices, get device, get actions, execute action, get programs", category: "Lifestyle", tools: [...MIELE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Miele integration initialized"); },
    async onAfterConnect() { logger.debug("Miele integration connected"); },
  };
}

export type MieleTools = (typeof MIELE_TOOLS)[number];
export type MieleScopes = (typeof MIELE_SCOPES)[number];
export type { MieleIntegrationClient } from "./miele-client.js";
