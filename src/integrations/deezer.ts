import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Deezer");

const DEEZER_SCOPES = [
  "basic_access",
  "email",
  "manage_library",
  "delete_library",
  "listening_history",
  "offline_access",
] as const;

const DEEZER_TOOLS = [
  "deezer_get_user",
  "deezer_search",
  "deezer_get_album",
  "deezer_get_track",
  "deezer_list_playlists",
  "deezer_add_track_to_playlist",
] as const;

export interface DeezerIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function deezerIntegration(config: DeezerIntegrationConfig = {}): MCPIntegration<"deezer"> {
  const oauth: OAuthConfig = { provider: "deezer", clientId: config.clientId ?? getEnv("DEEZER_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("DEEZER_CLIENT_SECRET"), scopes: config.scopes ?? [...DEEZER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "deezer", name: "Deezer", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/deezer.png", description: "Manage Deezer get user, search, get album, get track, list playlists", category: "Entertainment", tools: [...DEEZER_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Deezer integration initialized"); },
    async onAfterConnect() { logger.debug("Deezer integration connected"); },
  };
}

export type DeezerTools = (typeof DEEZER_TOOLS)[number];
export type DeezerScopes = (typeof DEEZER_SCOPES)[number];
export type { DeezerIntegrationClient } from "./deezer-client.js";
