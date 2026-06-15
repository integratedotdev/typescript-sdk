/**
 * Google Tasks Integration
 * Enables Google Tasks tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Tasks");

export interface GoogleTasksIntegrationConfig {
  /** Google OAuth client ID (defaults to GOOGLE_TASKS_CLIENT_ID env var) */
  clientId?: string;
  /** Google OAuth client secret (defaults to GOOGLE_TASKS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes (default uses Google Tasks scope on the server) */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const GOOGLE_TASKS_TOOLS = [
  "google_tasks_clear_completed",
  "google_tasks_create_task",
  "google_tasks_create_tasklist",
  "google_tasks_delete_task",
  "google_tasks_delete_tasklist",
  "google_tasks_get_task",
  "google_tasks_get_tasklist",
  "google_tasks_list_tasklists",
  "google_tasks_list_tasks",
  "google_tasks_move_task",
  "google_tasks_update_task",
  "google_tasks_update_tasklist",
] as const;

export function googleTasksIntegration(config: GoogleTasksIntegrationConfig = {}): MCPIntegration<"google_tasks"> {
  const oauth: OAuthConfig = {
    provider: "google_tasks",
    clientId: config.clientId ?? getEnv("GOOGLE_TASKS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_TASKS_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "google_tasks",
    name: "Google Tasks",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_tasks.png",
    description: "Manage Google Tasks lists and to-dos synced with your Google account",
    category: "Productivity",
    tools: [...GOOGLE_TASKS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Tasks integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Tasks integration connected");
    },
  };
}

export type GoogleTasksTools = (typeof GOOGLE_TASKS_TOOLS)[number];

export type { GoogleTasksIntegrationClient } from "./google_tasks-client.js";
