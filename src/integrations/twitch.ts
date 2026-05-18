import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Twitch");

const TWITCH_SCOPES = [
  "user:read:email",
  "channel:read:subscriptions",
  "clips:edit",
  "channel:manage:broadcast",
  "user:read:follows",
] as const;

const TWITCH_TOOLS = [
  "twitch_get_users",
  "twitch_get_streams",
  "twitch_get_channels",
  "twitch_modify_channel",
  "twitch_create_clip",
  "twitch_get_videos",
  "twitch_get_games",
  "twitch_get_channel_followers",
  "twitch_get_broadcaster_subscriptions",
] as const;

export interface TwitchIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function twitchIntegration(config: TwitchIntegrationConfig = {}): MCPIntegration<"twitch"> {
  const oauth: OAuthConfig = { provider: "twitch", clientId: config.clientId ?? getEnv("TWITCH_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TWITCH_CLIENT_SECRET"), scopes: config.scopes ?? [...TWITCH_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "twitch", name: "Twitch", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/twitch.png", description: "Manage Twitch users, streams, channels, clips, videos, games, follows, and subscriptions", category: "Entertainment", tools: [...TWITCH_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const clientId = config.clientId ?? getEnv("TWITCH_CLIENT_ID");
    const headers: Record<string, string> = {};
    if (clientId) headers["X-Twitch-Client-Id"] = clientId;
    return headers;
    },
    async onInit() { logger.debug("Twitch integration initialized"); },
    async onAfterConnect() { logger.debug("Twitch integration connected"); },
  };
}

export type TwitchTools = (typeof TWITCH_TOOLS)[number];
export type TwitchScopes = (typeof TWITCH_SCOPES)[number];
export type { TwitchIntegrationClient } from "./twitch-client.js";
