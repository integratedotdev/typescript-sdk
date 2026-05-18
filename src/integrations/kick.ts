import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Kick");

const KICK_SCOPES = [
  "user:read",
  "channel:read",
  "channel:write",
  "chat:write",
  "events:subscribe",
] as const;

const KICK_TOOLS = [
  "kick_get_users",
  "kick_get_channels",
  "kick_get_livestreams",
  "kick_get_categories",
  "kick_send_chat_message",
] as const;

export interface KickIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function kickIntegration(config: KickIntegrationConfig = {}): MCPIntegration<"kick"> {
  const oauth: OAuthConfig = { provider: "kick", clientId: config.clientId ?? getEnv("KICK_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("KICK_CLIENT_SECRET"), scopes: config.scopes ?? [...KICK_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "kick", name: "Kick", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/kick.png", description: "Manage Kick get users, get channels, get livestreams, get categories, send chat message", category: "Entertainment", tools: [...KICK_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Kick integration initialized"); },
    async onAfterConnect() { logger.debug("Kick integration connected"); },
  };
}

export type KickTools = (typeof KICK_TOOLS)[number];
export type KickScopes = (typeof KICK_SCOPES)[number];
export type { KickIntegrationClient } from "./kick-client.js";
