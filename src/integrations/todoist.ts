/**
 * Todoist Integration
 * Enables Todoist tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Todoist');

/**
 * Todoist integration configuration
 * 
 * SERVER-SIDE: Automatically reads TODOIST_CLIENT_ID and TODOIST_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface TodoistIntegrationConfig {
  /** Todoist OAuth client ID (defaults to TODOIST_CLIENT_ID env var) */
  clientId?: string;
  /** Todoist OAuth client secret (defaults to TODOIST_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['data:read_write']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Todoist tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const TODOIST_TOOLS = [
  // Projects
  "todoist_list_projects",
  "todoist_get_project",
  "todoist_create_project",
  "todoist_update_project",
  "todoist_delete_project",
  "todoist_archive_project",
  // Tasks
  "todoist_list_tasks",
  "todoist_get_task",
  "todoist_create_task",
  "todoist_update_task",
  "todoist_complete_task",
  "todoist_delete_task",
  "todoist_reopen_task",
  "todoist_move_task",
  "todoist_quick_add_task",
  "todoist_get_completed_tasks",
  "todoist_filter_tasks",
  // Sections
  "todoist_list_sections",
  "todoist_create_section",
  "todoist_get_section",
  "todoist_update_section",
  "todoist_delete_section",
  // Comments
  "todoist_list_comments",
  "todoist_create_comment",
  "todoist_get_comment",
  "todoist_update_comment",
  "todoist_delete_comment",
  // Labels
  "todoist_list_labels",
  "todoist_create_label",
  "todoist_update_label",
  "todoist_delete_label",
  // Reminders
  "todoist_list_reminders",
  "todoist_create_reminder",
] as const;


export function todoistIntegration(config: TodoistIntegrationConfig = {}): MCPIntegration<"todoist"> {
  const oauth: OAuthConfig = {
    provider: "todoist",
    clientId: config.clientId ?? getEnv('TODOIST_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('TODOIST_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "todoist",
    name: "Todoist",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/todoist.png",
    tools: [...TODOIST_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Todoist integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Todoist integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type TodoistTools = typeof TODOIST_TOOLS[number];

/**
 * Export Todoist client types
 */
export type { TodoistIntegrationClient } from "./todoist-client.js";

