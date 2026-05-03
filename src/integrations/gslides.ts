/**
 * Google Slides Integration
 * Enables Google Slides tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Slides');

export interface GSlidesIntegrationConfig {
  /** Google OAuth client ID (defaults to GSLIDES_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GSLIDES_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GSLIDES_TOOLS = [
  "gslides_add_slide",
  "gslides_batch_update",
  "gslides_create",
  "gslides_delete",
  "gslides_delete_slide",
  "gslides_get",
  "gslides_get_page",
  "gslides_list",
  "gslides_update_text",
] as const;

export function gslidesIntegration(config: GSlidesIntegrationConfig = {}): MCPIntegration<"gslides"> {
  const oauth: OAuthConfig = {
    provider: "gslides",
    clientId: config.clientId ?? getEnv('GSLIDES_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GSLIDES_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "gslides",
    name: "Google Slides",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_slides.png",
    tools: [...GSLIDES_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Slides integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Slides integration connected");
    },
  };
}

export type GSlidesTools = typeof GSLIDES_TOOLS[number];
export type { GSlidesIntegrationClient } from "./gslides-client.js";
