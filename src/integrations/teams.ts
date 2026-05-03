/**
 * Microsoft Teams Integration
 * Enables Microsoft Teams tools via Microsoft Graph with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Teams");

const TEAMS_SCOPES = [
  "offline_access",
  "User.Read",
  "Team.ReadBasic.All",
  "Channel.ReadBasic.All",
  "ChannelMessage.Read.All",
  "ChannelMessage.Send",
  "Chat.Read",
  "Chat.ReadWrite",
] as const;

const TEAMS_TOOLS = [
  "teams_get_channel",
  "teams_get_chat",
  "teams_get_profile",
  "teams_get_team",
  "teams_list_channel_messages",
  "teams_list_channels",
  "teams_list_chat_messages",
  "teams_list_chats",
  "teams_list_teams",
  "teams_reply_channel_message",
  "teams_send_channel_message",
  "teams_send_chat_message",
] as const;

export interface TeamsIntegrationConfig {
  /** Azure AD app client ID (defaults to TEAMS_CLIENT_ID env var) */
  clientId?: string;
  /** Azure AD app client secret (defaults to TEAMS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** Optional scopes the user may decline */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function teamsIntegration(config: TeamsIntegrationConfig = {}): MCPIntegration<"teams"> {
  const oauth: OAuthConfig = {
    provider: "teams",
    clientId: config.clientId ?? getEnv("TEAMS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("TEAMS_CLIENT_SECRET"),
    scopes: config.scopes ?? [...TEAMS_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
      authorization_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      token_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "teams",
    name: "Microsoft Teams",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/teams.png",
    description:
      "Collaborate in Teams channels and chats using Microsoft Graph — teams, channels, messages, and profile.",
    category: "Communication",
    tools: [...TEAMS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Teams integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Teams integration connected");
    },
  };
}

export type TeamsTools = (typeof TEAMS_TOOLS)[number];
export type TeamsScopes = (typeof TEAMS_SCOPES)[number];

export type { TeamsIntegrationClient } from "./teams-client.js";
