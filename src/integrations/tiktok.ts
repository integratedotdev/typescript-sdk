import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("TikTok");

const TIKTOK_SCOPES = ["user.info.basic", "video.list"] as const;

const TIKTOK_TOOLS = [
  "tiktok_get_user_info",
  "tiktok_list_videos",
  "tiktok_query_videos",
] as const;

export interface TikTokIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function tiktokIntegration(config: TikTokIntegrationConfig = {}): MCPIntegration<"tiktok"> {
  const oauth: OAuthConfig = {
    provider: "tiktok",
    clientId: config.clientId ?? getEnv("TIKTOK_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("TIKTOK_CLIENT_SECRET"),
    scopes: config.scopes ?? [...TIKTOK_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://www.tiktok.com/v2/auth/authorize/",
      token_endpoint: "https://open.tiktokapis.com/v2/oauth/token/",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "tiktok",
    name: "TikTok",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tiktok.png",
    description: "Read TikTok user profile data and user-authorized video metadata",
    category: "Social",
    tools: [...TIKTOK_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("TikTok integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("TikTok integration connected");
    },
  };
}

export type TikTokTools = (typeof TIKTOK_TOOLS)[number];
export type TikTokScopes = (typeof TIKTOK_SCOPES)[number];
export type { TikTokIntegrationClient } from "./tiktok-client.js";
