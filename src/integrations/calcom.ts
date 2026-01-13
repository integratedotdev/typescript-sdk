/**
 * Cal.com Integration
 * Enables Cal.com tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Cal.com');

/**
 * Cal.com integration configuration
 * 
 * SERVER-SIDE: Automatically reads CALCOM_CLIENT_ID and CALCOM_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface CalcomIntegrationConfig {
  /** Cal.com OAuth client ID (defaults to CALCOM_CLIENT_ID env var) */
  clientId?: string;
  /** Cal.com OAuth client secret (defaults to CALCOM_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['read:bookings', 'write:bookings', 'read:event-types', 'read:schedules']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** Cal.com API base URL (default: https://api.cal.com/v1) */
  apiBaseUrl?: string;
}

/**
 * Default Cal.com tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const CALCOM_TOOLS = [
  "calcom_list_bookings",
  "calcom_get_booking",
  "calcom_create_booking",
  "calcom_cancel_booking",
  "calcom_reschedule_booking",
  "calcom_list_event_types",
  "calcom_get_availability",
  "calcom_list_schedules",
  "calcom_get_me",
] as const;


export function calcomIntegration(config: CalcomIntegrationConfig = {}): MCPIntegration<"calcom"> {
  const oauth: OAuthConfig = {
    provider: "calcom",
    clientId: config.clientId ?? getEnv('CALCOM_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('CALCOM_CLIENT_SECRET'),
    scopes: config.scopes || ["read:bookings", "write:bookings", "read:event-types", "read:schedules"],
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.cal.com/v1",
      ...config,
    },
  };

  return {
    id: "calcom",
    tools: [...CALCOM_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Cal.com integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Cal.com integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type CalcomTools = typeof CALCOM_TOOLS[number];

/**
 * Export Cal.com client types
 */
export type { CalcomIntegrationClient } from "./calcom-client.js";
