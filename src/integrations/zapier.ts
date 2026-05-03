/**
 * Zapier Integration
 * Partner Workflow API — Zaps, apps, authentications, and Zap run history (OAuth2)
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zapier");

const ZAPIER_TOOLS = [
  "zapier_get_profile",
  "zapier_list_zaps",
  "zapier_list_apps",
  "zapier_list_actions",
  "zapier_list_authentications",
  "zapier_list_zap_runs",
] as const;

export interface ZapierIntegrationConfig {
  /** Zapier OAuth client ID (defaults to ZAPIER_CLIENT_ID) */
  clientId?: string;
  /** Zapier OAuth client secret (defaults to ZAPIER_CLIENT_SECRET) */
  clientSecret?: string;
  /** Override default Workflow API scopes */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function zapierIntegration(config: ZapierIntegrationConfig = {}): MCPIntegration<"zapier"> {
  const oauth: OAuthConfig = {
    provider: "zapier",
    clientId: config.clientId ?? getEnv("ZAPIER_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("ZAPIER_CLIENT_SECRET"),
    scopes: config.scopes ?? [],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://zapier.com/oauth/authorize/",
      token_endpoint: "https://zapier.com/oauth/token/",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "zapier",
    name: "Zapier",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zapier.png",
    description: "List Zaps, browse apps, manage authentications, and inspect Zap runs via the Partner Workflow API",
    category: "Productivity",
    tools: [...ZAPIER_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Zapier integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Zapier integration connected");
    },
  };
}

export type ZapierTools = (typeof ZAPIER_TOOLS)[number];

export type { ZapierIntegrationClient } from "./zapier-client.js";
