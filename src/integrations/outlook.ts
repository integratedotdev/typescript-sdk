/**
 * Outlook Integration
 * Enables Microsoft Outlook tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Outlook');

/**
 * Outlook integration configuration
 * 
 * SERVER-SIDE: Automatically reads OUTLOOK_CLIENT_ID and OUTLOOK_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface OutlookIntegrationConfig {
  /** Microsoft OAuth client ID (defaults to OUTLOOK_CLIENT_ID env var) */
  clientId?: string;
  /** Microsoft OAuth client secret (defaults to OUTLOOK_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['Mail.Read', 'Mail.Send', 'Calendars.ReadWrite', 'Contacts.Read']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Outlook tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const OUTLOOK_TOOLS = [
  // Email
  "outlook_list_messages",
  "outlook_get_message",
  "outlook_send_message",
  "outlook_search_messages",
  "outlook_reply_message",
  "outlook_reply_all_message",
  "outlook_forward_message",
  "outlook_delete_message",
  "outlook_move_message",
  "outlook_mark_message_read",
  "outlook_create_draft",
  "outlook_list_mail_folders",
  // Calendar
  "outlook_list_events",
  "outlook_get_event",
  "outlook_create_event",
  "outlook_update_event",
  "outlook_delete_event",
  "outlook_list_calendars",
  "outlook_accept_event",
  "outlook_decline_event",
  "outlook_tentatively_accept_event",
  "outlook_find_meeting_times",
  "outlook_get_schedule",
  // Contacts
  "outlook_list_contacts",
  "outlook_get_contact",
] as const;


export function outlookIntegration(config: OutlookIntegrationConfig = {}): MCPIntegration<"outlook"> {
  const oauth: OAuthConfig = {
    provider: "outlook",
    clientId: config.clientId ?? getEnv('OUTLOOK_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('OUTLOOK_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "outlook",
    name: "Outlook",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/outlook.png",
    tools: [...OUTLOOK_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Outlook integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Outlook integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type OutlookTools = typeof OUTLOOK_TOOLS[number];

/**
 * Export Outlook client types
 */
export type { OutlookIntegrationClient } from "./outlook-client.js";

