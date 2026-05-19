import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Play Console");

const GOOGLE_PLAY_CONSOLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/androidpublisher",
] as const;

const GOOGLE_PLAY_CONSOLE_TOOLS = [
  "google_play_console_insert_edit",
  "google_play_console_get_edit",
  "google_play_console_list_tracks",
  "google_play_console_update_track",
  "google_play_console_commit_edit",
  "google_play_console_list_in_app_products",
] as const;

export interface GooglePlayConsoleIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function googlePlayConsoleIntegration(config: GooglePlayConsoleIntegrationConfig = {}): MCPIntegration<"google_play_console"> {
  const oauth: OAuthConfig = { provider: "google_play_console", clientId: config.clientId ?? getEnv("GOOGLE_PLAY_CONSOLE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOOGLE_PLAY_CONSOLE_CLIENT_SECRET"), scopes: config.scopes ?? [...GOOGLE_PLAY_CONSOLE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "google_play_console", name: "Google Play Console", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_play_console.png", description: "Manage Google Play edits, tracks, and in-app products through the Android Publisher API", category: "Engineering", tools: [...GOOGLE_PLAY_CONSOLE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Google Play Console integration initialized"); },
    async onAfterConnect() { logger.debug("Google Play Console integration connected"); },
  };
}

export type GooglePlayConsoleTools = (typeof GOOGLE_PLAY_CONSOLE_TOOLS)[number];
export type GooglePlayConsoleScopes = (typeof GOOGLE_PLAY_CONSOLE_SCOPES)[number];
export type { GooglePlayConsoleIntegrationClient } from "./google_play_console-client.js";
