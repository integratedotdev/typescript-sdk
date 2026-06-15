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
 * SERVER-SIDE: Automatically reads GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface GoogleCalendarIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_CALENDAR_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_CALENDAR_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['https://www.googleapis.com/auth/calendar']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Google Calendar tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const GOOGLE_CALENDAR_TOOLS = [
  "google_calendar_create_calendar",
  "google_calendar_create_event",
  "google_calendar_delete_calendar",
  "google_calendar_delete_event",
  "google_calendar_freebusy",
  "google_calendar_get_calendar",
  "google_calendar_get_event",
  "google_calendar_list_attendees",
  "google_calendar_list_calendars",
  "google_calendar_list_events",
  "google_calendar_quick_add",
  "google_calendar_update_event",
] as const;


export function googleCalendarIntegration(config: GoogleCalendarIntegrationConfig = {}): MCPIntegration<"google_calendar"> {
  const oauth: OAuthConfig = {
    provider: "google_calendar",
    clientId: config.clientId ?? getEnv('GOOGLE_CALENDAR_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GOOGLE_CALENDAR_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "google_calendar",
    name: "Google Calendar",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_calendar.webp",
    tools: [...GOOGLE_CALENDAR_TOOLS],
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
export type GoogleCalendarTools = typeof GOOGLE_CALENDAR_TOOLS[number];

/**
 * Export Google Calendar client types
 */
export type { GoogleCalendarIntegrationClient } from "./google_calendar-client.js";

