import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Chat");

const GOOGLE_CHAT_SCOPES = [
  "https://www.googleapis.com/auth/chat.messages",
  "https://www.googleapis.com/auth/chat.spaces.readonly",
] as const;

const GOOGLE_CHAT_TOOLS = [
  "google_chat_delete_message",
  "google_chat_get_message",
  "google_chat_get_space",
  "google_chat_list_members",
  "google_chat_list_messages",
  "google_chat_list_spaces",
  "google_chat_send_message",
  "google_chat_update_message",
] as const;

export interface GoogleChatIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function googleChatIntegration(config: GoogleChatIntegrationConfig = {}): MCPIntegration<"google_chat"> {
  const oauth: OAuthConfig = {
    provider: "google_chat",
    clientId: config.clientId ?? getEnv("GOOGLE_CHAT_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_CHAT_CLIENT_SECRET"),
    scopes: config.scopes ?? [...GOOGLE_CHAT_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      token_endpoint: "https://oauth2.googleapis.com/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "google_chat",
    name: "Google Chat",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_chat.png",
    description: "List Google Chat spaces and manage messages and memberships",
    category: "Communication",
    tools: [...GOOGLE_CHAT_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Google Chat integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Google Chat integration connected");
    },
  };
}

export type GoogleChatTools = (typeof GOOGLE_CHAT_TOOLS)[number];
export type GoogleChatScopes = (typeof GOOGLE_CHAT_SCOPES)[number];
export type { GoogleChatIntegrationClient } from "./google_chat-client.js";
