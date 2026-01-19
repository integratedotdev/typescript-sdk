/**
 * Linear Integration
 * Enables Linear tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Linear');

/**
 * Linear integration configuration
 * 
 * SERVER-SIDE: Automatically reads LINEAR_CLIENT_ID and LINEAR_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface LinearIntegrationConfig {
  /** Linear OAuth client ID (defaults to LINEAR_CLIENT_ID env var) */
  clientId?: string;
  /** Linear OAuth client secret (defaults to LINEAR_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['read', 'write', 'issues:create']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Linear tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const LINEAR_TOOLS = [
  "linear_create_issue",
  "linear_list_issues",
  "linear_get_issue",
  "linear_update_issue",
  "linear_list_projects",
  "linear_list_teams",
  "linear_add_comment",
  "linear_list_labels",
  "linear_search_issues",
] as const;


export function linearIntegration(config: LinearIntegrationConfig = {}): MCPIntegration<"linear"> {
  const oauth: OAuthConfig = {
    provider: "linear",
    clientId: config.clientId ?? getEnv('LINEAR_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('LINEAR_CLIENT_SECRET'),
    scopes: config.scopes || ["read", "write", "issues:create"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "linear",
    name: "Linear",
    logoUrl: "https://cdn.simpleicons.org/linear",
    tools: [...LINEAR_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Linear integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Linear integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type LinearTools = typeof LINEAR_TOOLS[number];

/**
 * Export Linear client types
 */
export type { LinearIntegrationClient } from "./linear-client.js";

