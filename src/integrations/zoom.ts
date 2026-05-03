/**
 * Zoom Integration
 * Zoom Meetings API with OAuth 2.0
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoom");

/**
 * Zoom integration configuration
 *
 * SERVER-SIDE: Reads ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET from the environment when unset.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient().
 */
export interface ZoomIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

const ZOOM_TOOLS = [
  "zoom_get_user",
  "zoom_list_meetings",
  "zoom_create_meeting",
  "zoom_get_meeting",
  "zoom_update_meeting",
  "zoom_delete_meeting",
] as const;

export function zoomIntegration(config: ZoomIntegrationConfig = {}): MCPIntegration<"zoom"> {
  const oauth: OAuthConfig = {
    provider: "zoom",
    clientId: config.clientId ?? getEnv("ZOOM_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("ZOOM_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: { ...config },
  };

  return {
    id: "zoom",
    name: "Zoom",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoom.png",
    tools: [...ZOOM_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Zoom integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Zoom integration connected");
    },
  };
}

export type ZoomTools = (typeof ZOOM_TOOLS)[number];

export type { ZoomIntegrationClient } from "./zoom-client.js";
