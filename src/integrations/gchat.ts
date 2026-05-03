import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Chat");

const GCHAT_SCOPES = [
  "https://www.googleapis.com/auth/chat.messages",
  "https://www.googleapis.com/auth/chat.spaces.readonly",
] as const;

const GCHAT_TOOLS = [
  "gchat_delete_message",
  "gchat_get_message",
  "gchat_get_space",
  "gchat_list_members",
  "gchat_list_messages",
  "gchat_list_spaces",
  "gchat_send_message",
  "gchat_update_message",
] as const;

export interface GchatIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function gchatIntegration(config: GchatIntegrationConfig = {}): MCPIntegration<"gchat"> {
  const oauth: OAuthConfig = {
    provider: "gchat",
    clientId: config.clientId ?? getEnv("GCHAT_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GCHAT_CLIENT_SECRET"),
    scopes: config.scopes ?? [...GCHAT_SCOPES],
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
    id: "gchat",
    name: "Google Chat",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_chat.png",
    description: "List Google Chat spaces and manage messages and memberships",
    category: "Communication",
    tools: [...GCHAT_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Google Chat integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Google Chat integration connected");
    },
  };
}

export type GchatTools = (typeof GCHAT_TOOLS)[number];
export type GchatScopes = (typeof GCHAT_SCOPES)[number];
export type { GchatIntegrationClient } from "./gchat-client.js";
