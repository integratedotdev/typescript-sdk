/**
 * Google Tasks Integration
 * Enables Google Tasks tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Tasks");

export interface GtasksIntegrationConfig {
  /** Google OAuth client ID (defaults to GTASKS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GTASKS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes (default uses Google Tasks scope on the server) */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GTASKS_TOOLS = [
  "gtasks_clear_completed",
  "gtasks_create_task",
  "gtasks_create_tasklist",
  "gtasks_delete_task",
  "gtasks_delete_tasklist",
  "gtasks_get_task",
  "gtasks_get_tasklist",
  "gtasks_list_tasklists",
  "gtasks_list_tasks",
  "gtasks_move_task",
  "gtasks_update_task",
  "gtasks_update_tasklist",
] as const;

export function gtasksIntegration(config: GtasksIntegrationConfig = {}): MCPIntegration<"gtasks"> {
  const oauth: OAuthConfig = {
    provider: "gtasks",
    clientId: config.clientId ?? getEnv("GTASKS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GTASKS_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "gtasks",
    name: "Google Tasks",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_tasks.png",
    description: "Manage Google Tasks lists and to-dos synced with your Google account",
    category: "Productivity",
    tools: [...GTASKS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Tasks integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Tasks integration connected");
    },
  };
}

export type GtasksTools = (typeof GTASKS_TOOLS)[number];

export type { GtasksIntegrationClient } from "./gtasks-client.js";
