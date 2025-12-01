/**
 * Outlook Integration
 * Enables Microsoft Outlook tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

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
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Outlook tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const OUTLOOK_TOOLS = [
  "outlook_list_messages",
  "outlook_get_message",
  "outlook_send_message",
  "outlook_list_events",
  "outlook_get_event",
  "outlook_create_event",
  "outlook_list_contacts",
  "outlook_get_contact",
  "outlook_search",
] as const;


export function outlookIntegration(config: OutlookIntegrationConfig = {}): MCPIntegration<"outlook"> {
  const oauth: OAuthConfig = {
    provider: "outlook",
    clientId: config.clientId ?? getEnv('OUTLOOK_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('OUTLOOK_CLIENT_SECRET'),
    scopes: config.scopes || ["Mail.Read", "Mail.Send", "Calendars.ReadWrite", "Contacts.Read"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "outlook",
    tools: [...OUTLOOK_TOOLS],
    oauth,

    async onInit(_client) {
      console.log("Outlook integration initialized");
    },

    async onAfterConnect(_client) {
      console.log("Outlook integration connected");
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

