/**
 * Google Meet Integration — Calendar-backed meetings with Meet conference links.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Meet");

const GOOGLE_MEET_TOOLS = [
  "google_meet_add_meet_to_event",
  "google_meet_create_meeting",
  "google_meet_delete_meeting",
  "google_meet_get_meeting",
  "google_meet_list_meetings",
  "google_meet_update_meeting",
] as const;

export interface GoogleMeetIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_MEET_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_MEET_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (default includes full Calendar access for conference creation) */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function googleMeetIntegration(config: GoogleMeetIntegrationConfig = {}): MCPIntegration<"google_meet"> {
  const oauth: OAuthConfig = {
    provider: "google_meet",
    clientId: config.clientId ?? getEnv("GOOGLE_MEET_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_MEET_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: { ...config },
  };

  return {
    id: "google_meet",
    name: "Google Meet",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_meet.png",
    description: "Create and manage Google Meet links via Calendar conference data",
    category: "Communication",
    tools: [...GOOGLE_MEET_TOOLS],
    oauth,

    async onInit(_client: unknown) {
      logger.debug("Google Meet integration initialized");
    },

    async onAfterConnect(_client: unknown) {
      logger.debug("Google Meet integration connected");
    },
  };
}

export type GoogleMeetTools = (typeof GOOGLE_MEET_TOOLS)[number];
export type { GoogleMeetIntegrationClient } from "./google_meet-client.js";
