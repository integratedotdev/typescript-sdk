/**
 * Google Meet Integration — Calendar-backed meetings with Meet conference links.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Meet");

const GMEET_TOOLS = [
  "gmeet_add_meet_to_event",
  "gmeet_create_meeting",
  "gmeet_delete_meeting",
  "gmeet_get_meeting",
  "gmeet_list_meetings",
  "gmeet_update_meeting",
] as const;

export interface GmeetIntegrationConfig {
  /** Google OAuth client ID (defaults to GMEET_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GMEET_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (default includes full Calendar access for conference creation) */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function gmeetIntegration(config: GmeetIntegrationConfig = {}): MCPIntegration<"gmeet"> {
  const oauth: OAuthConfig = {
    provider: "gmeet",
    clientId: config.clientId ?? getEnv("GMEET_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GMEET_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: { ...config },
  };

  return {
    id: "gmeet",
    name: "Google Meet",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_meet.png",
    description: "Create and manage Google Meet links via Calendar conference data",
    category: "Communication",
    tools: [...GMEET_TOOLS],
    oauth,

    async onInit(_client: unknown) {
      logger.debug("Google Meet integration initialized");
    },

    async onAfterConnect(_client: unknown) {
      logger.debug("Google Meet integration connected");
    },
  };
}

export type GmeetTools = (typeof GMEET_TOOLS)[number];
export type { GmeetIntegrationClient } from "./gmeet-client.js";
