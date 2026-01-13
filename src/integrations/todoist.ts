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
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Todoist tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const TODOIST_TOOLS = [
  "todoist_list_projects",
  "todoist_get_project",
  "todoist_create_project",
  "todoist_list_tasks",
  "todoist_get_task",
  "todoist_create_task",
  "todoist_complete_task",
  "todoist_list_labels",
  "todoist_create_label",
] as const;


export function todoistIntegration(config: TodoistIntegrationConfig = {}): MCPIntegration<"todoist"> {
  const oauth: OAuthConfig = {
    provider: "todoist",
    clientId: config.clientId ?? getEnv('TODOIST_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('TODOIST_CLIENT_SECRET'),
    scopes: config.scopes || ["data:read_write"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "todoist",
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

