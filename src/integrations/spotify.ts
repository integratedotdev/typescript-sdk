import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Spotify");

const SPOTIFY_SCOPES = [
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
] as const;

const SPOTIFY_TOOLS = [
  "spotify_get_current_user",
  "spotify_search",
  "spotify_get_track",
  "spotify_get_album",
  "spotify_list_user_playlists",
  "spotify_get_playlist",
  "spotify_create_playlist",
  "spotify_add_playlist_items",
  "spotify_remove_playlist_items",
  "spotify_get_saved_tracks",
  "spotify_save_tracks",
  "spotify_remove_saved_tracks",
  "spotify_get_playback_state",
  "spotify_start_playback",
  "spotify_pause_playback",
] as const;

export interface SpotifyIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function spotifyIntegration(config: SpotifyIntegrationConfig = {}): MCPIntegration<"spotify"> {
  const oauth: OAuthConfig = {
    provider: "spotify",
    clientId: config.clientId ?? getEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SPOTIFY_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SPOTIFY_SCOPES],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "spotify",
    name: "Spotify",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/spotify.png",
    description: "Search Spotify, manage playlists and saved tracks, and control playback",
    category: "Entertainment",
    tools: [...SPOTIFY_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Spotify integration initialized"); },
    async onAfterConnect() { logger.debug("Spotify integration connected"); },
  };
}

export type SpotifyTools = (typeof SPOTIFY_TOOLS)[number];
export type SpotifyScopes = (typeof SPOTIFY_SCOPES)[number];
export type { SpotifyIntegrationClient } from "./spotify-client.js";
