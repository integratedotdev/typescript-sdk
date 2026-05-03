/**
 * Discord Integration
 * OAuth2 (user + bot scopes) per Discord API; channel/message tools use the MCP server bot token.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Discord");

const DISCORD_TOOLS = [
  "discord_get_current_user",
  "discord_list_my_guilds",
  "discord_get_guild",
  "discord_list_guild_channels",
  "discord_get_channel",
  "discord_send_message",
  "discord_list_messages",
  "discord_edit_message",
  "discord_delete_message",
] as const;

export interface DiscordIntegrationConfig {
  /** Discord application OAuth2 client id (defaults to DISCORD_CLIENT_ID) */
  clientId?: string;
  /** Discord application client secret (defaults to DISCORD_CLIENT_SECRET) */
  clientSecret?: string;
  /** OAuth scopes (default matches MCP server: identify, email, guilds, bot, applications.commands) */
  scopes?: string[];
  redirectUri?: string;
}

export function discordIntegration(config: DiscordIntegrationConfig = {}): MCPIntegration<"discord"> {
  const oauth: OAuthConfig = {
    provider: "discord",
    clientId: config.clientId ?? getEnv("DISCORD_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("DISCORD_CLIENT_SECRET"),
    scopes:
      config.scopes ??
      ["identify", "email", "guilds", "bot", "applications.commands"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "discord",
    name: "Discord",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/discord.png",
    description: "Send and manage Discord messages; list guilds and channels (bot token required on server for channel APIs)",
    category: "Communication",
    tools: [...DISCORD_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Discord integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Discord integration connected");
    },
  };
}

export type DiscordTools = (typeof DISCORD_TOOLS)[number];

export type { DiscordIntegrationClient } from "./discord-client.js";
