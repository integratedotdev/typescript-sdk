import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Klaviyo");

const KLAVIYO_SCOPES = [
  "accounts:read",
  "profiles:read",
  "profiles:write",
  "lists:read",
  "lists:write",
  "campaigns:read",
  "campaigns:write",
  "metrics:read",
] as const;

const KLAVIYO_TOOLS = [
  "klaviyo_list_accounts",
  "klaviyo_list_profiles",
  "klaviyo_get_profile",
  "klaviyo_create_profile",
  "klaviyo_list_lists",
  "klaviyo_list_campaigns",
  "klaviyo_create_campaign",
  "klaviyo_list_metrics",
] as const;

export interface KlaviyoIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  revision?: string;
}

export function klaviyoIntegration(config: KlaviyoIntegrationConfig = {}): MCPIntegration<"klaviyo"> {
  const oauth: OAuthConfig = { provider: "klaviyo", clientId: config.clientId ?? getEnv("KLAVIYO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("KLAVIYO_CLIENT_SECRET"), scopes: config.scopes ?? [...KLAVIYO_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "klaviyo", name: "Klaviyo", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/klaviyo.png", description: "Manage Klaviyo accounts, profiles, lists, segments, campaigns, and metrics", category: "Marketing", tools: [...KLAVIYO_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      const revision = config.revision ?? getEnv("KLAVIYO_REVISION") ?? "2024-10-15";
      if (revision) headers["revision"] = revision;
      return headers;
    },
    async onInit() { logger.debug("Klaviyo integration initialized"); },
    async onAfterConnect() { logger.debug("Klaviyo integration connected"); },
  };
}

export type KlaviyoTools = (typeof KLAVIYO_TOOLS)[number];
export type KlaviyoScopes = (typeof KLAVIYO_SCOPES)[number];
export type { KlaviyoIntegrationClient } from "./klaviyo-client.js";
