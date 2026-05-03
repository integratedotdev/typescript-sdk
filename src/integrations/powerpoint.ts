/**
 * PowerPoint Integration
 * Enables PowerPoint presentation tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('PowerPoint');

export interface PowerPointIntegrationConfig {
  /** Microsoft OAuth client ID (defaults to POWERPOINT_CLIENT_ID env var) */
  clientId?: string;
  /** Microsoft OAuth client secret (defaults to POWERPOINT_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const POWERPOINT_TOOLS = [
  "powerpoint_copy",
  "powerpoint_create",
  "powerpoint_delete",
  "powerpoint_get",
  "powerpoint_list",
  "powerpoint_share",
  "powerpoint_update_content",
] as const;

export function powerpointIntegration(config: PowerPointIntegrationConfig = {}): MCPIntegration<"powerpoint"> {
  const oauth: OAuthConfig = {
    provider: "powerpoint",
    clientId: config.clientId ?? getEnv('POWERPOINT_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('POWERPOINT_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "powerpoint",
    name: "PowerPoint",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/powerpoint.png",
    tools: [...POWERPOINT_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("PowerPoint integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("PowerPoint integration connected");
    },
  };
}

export type PowerPointTools = typeof POWERPOINT_TOOLS[number];
export type { PowerPointIntegrationClient } from "./powerpoint-client.js";
