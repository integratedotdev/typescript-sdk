/**
 * Google Calendar Integration
 * Enables Google Calendar tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Calendar');

/**
 * Google Calendar integration configuration
 * 
 * SERVER-SIDE: Automatically reads GCAL_CLIENT_ID and GCAL_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface GcalIntegrationConfig {
  /** Google OAuth client ID (defaults to GCAL_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GCAL_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['https://www.googleapis.com/auth/calendar']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Google Calendar tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const GCAL_TOOLS = [
  "gcal_list_calendars",
  "gcal_get_calendar",
  "gcal_list_events",
  "gcal_get_event",
  "gcal_create_event",
  "gcal_update_event",
  "gcal_delete_event",
  "gcal_list_attendees",
  "gcal_quick_add",
] as const;


export function gcalIntegration(config: GcalIntegrationConfig = {}): MCPIntegration<"gcal"> {
  const oauth: OAuthConfig = {
    provider: "gcal",
    clientId: config.clientId ?? getEnv('GCAL_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GCAL_CLIENT_SECRET'),
    scopes: config.scopes || ["https://www.googleapis.com/auth/calendar"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "gcal",
    name: "Google Calendar",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_calendar.webp",
    tools: [...GCAL_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Calendar integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Calendar integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type GcalTools = typeof GCAL_TOOLS[number];

/**
 * Export Google Calendar client types
 */
export type { GcalIntegrationClient } from "./gcal-client.js";

