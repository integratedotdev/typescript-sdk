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
  /** Additional OAuth scopes (default: ['READ_BOOKING', 'WRITE_BOOKING', 'READ_PROFILE', 'WRITE_PROFILE']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
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
  // Bookings
  "calcom_list_bookings",
  "calcom_get_booking",
  "calcom_create_booking",
  "calcom_cancel_booking",
  "calcom_reschedule_booking",
  "calcom_update_booking",
  "calcom_get_booking_recordings",
  "calcom_get_booking_transcripts",
  // Event Types
  "calcom_list_event_types",
  "calcom_get_event_type",
  "calcom_create_event_type",
  "calcom_update_event_type",
  "calcom_delete_event_type",
  "calcom_list_team_event_types",
  // Availability
  "calcom_get_availability",
  "calcom_get_availability_rule",
  "calcom_create_availability_rule",
  "calcom_update_availability_rule",
  "calcom_delete_availability_rule",
  // Schedules
  "calcom_list_schedules",
  "calcom_get_schedule",
  "calcom_create_schedule",
  "calcom_update_schedule",
  "calcom_delete_schedule",
  // Slots
  "calcom_get_slots",
  // Attendees
  "calcom_list_attendees",
  "calcom_get_attendee",
  "calcom_create_attendee",
  "calcom_update_attendee",
  "calcom_delete_attendee",
  // Teams
  "calcom_list_teams",
  "calcom_get_team",
  "calcom_create_team",
  "calcom_update_team",
  "calcom_delete_team",
  // Memberships
  "calcom_list_memberships",
  "calcom_get_membership",
  "calcom_create_membership",
  "calcom_update_membership",
  "calcom_delete_membership",
  // Webhooks
  "calcom_list_webhooks",
  "calcom_get_webhook",
  "calcom_create_webhook",
  "calcom_update_webhook",
  "calcom_delete_webhook",
  // Payments
  "calcom_list_payments",
  "calcom_get_payment",
  // Users
  "calcom_list_users",
  "calcom_get_user",
  "calcom_create_user",
  "calcom_update_user",
  "calcom_delete_user",
  // User Profile
  "calcom_get_me",
] as const;


export function calcomIntegration(config: CalcomIntegrationConfig = {}): MCPIntegration<"calcom"> {
  const oauth: OAuthConfig = {
    provider: "calcom",
    clientId: config.clientId ?? getEnv('CALCOM_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('CALCOM_CLIENT_SECRET'),
    scopes: config.scopes || ["READ_BOOKING", "WRITE_BOOKING", "READ_PROFILE", "WRITE_PROFILE"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.cal.com/v1",
      ...config,
    },
  };

  return {
    id: "calcom",
    name: "Cal.com",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/calcom.jpeg",
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
