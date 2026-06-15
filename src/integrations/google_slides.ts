/**
 * Google Slides Integration
 * Enables Google Slides tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Slides');

export interface GSlidesIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_SLIDES_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_SLIDES_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_SLIDES_TOOLS = [
  "google_slides_add_slide",
  "google_slides_batch_update",
  "google_slides_create",
  "google_slides_delete",
  "google_slides_delete_slide",
  "google_slides_get",
  "google_slides_get_page",
  "google_slides_list",
  "google_slides_update_text",
] as const;

export function googleSlidesIntegration(config: GSlidesIntegrationConfig = {}): MCPIntegration<"google_slides"> {
  const oauth: OAuthConfig = {
    provider: "google_slides",
    clientId: config.clientId ?? getEnv('GOOGLE_SLIDES_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GOOGLE_SLIDES_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "google_slides",
    name: "Google Slides",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_slides.png",
    tools: [...GOOGLE_SLIDES_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Slides integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Slides integration connected");
    },
  };
}

export type GSlidesTools = typeof GOOGLE_SLIDES_TOOLS[number];
export type { GSlidesIntegrationClient } from "./google_slides-client.js";
