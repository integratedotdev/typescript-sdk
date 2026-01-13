/**
 * Slack Integration
 * Enables Slack tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Slack');

/**
 * Slack integration configuration
 * 
 * SERVER-SIDE: Automatically reads SLACK_CLIENT_ID and SLACK_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface SlackIntegrationConfig {
  /** Slack OAuth client ID (defaults to SLACK_CLIENT_ID env var) */
  clientId?: string;
  /** Slack OAuth client secret (defaults to SLACK_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['chat:write', 'channels:read', 'users:read']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Slack tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const SLACK_TOOLS = [
  "slack_send_message",
  "slack_list_channels",
  "slack_get_channel",
  "slack_list_users",
  "slack_get_user",
  "slack_list_messages",
  "slack_add_reaction",
  "slack_search_messages",
  "slack_upload_file",
] as const;


export function slackIntegration(config: SlackIntegrationConfig = {}): MCPIntegration<"slack"> {
  const oauth: OAuthConfig = {
    provider: "slack",
    clientId: config.clientId ?? getEnv('SLACK_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('SLACK_CLIENT_SECRET'),
    scopes: config.scopes || ["chat:write", "channels:read", "users:read", "search:read", "files:write"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "slack",
    tools: [...SLACK_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Slack integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Slack integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type SlackTools = typeof SLACK_TOOLS[number];

/**
 * Export Slack client types
 */
export type { SlackIntegrationClient } from "./slack-client.js";

