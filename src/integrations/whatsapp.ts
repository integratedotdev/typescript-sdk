/**
 * WhatsApp Business Integration
 * Enables WhatsApp Business tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('WhatsApp');

/**
 * WhatsApp Business integration configuration
 * 
 * SERVER-SIDE: Automatically reads WHATSAPP_CLIENT_ID and WHATSAPP_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface WhatsAppIntegrationConfig {
  /** WhatsApp OAuth client ID (defaults to WHATSAPP_CLIENT_ID env var) */
  clientId?: string;
  /** WhatsApp OAuth client secret (defaults to WHATSAPP_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['business_management', 'whatsapp_business_messaging', 'whatsapp_business_management']) */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** WhatsApp Business Account ID */
  businessAccountId?: string;
}

/**
 * Default WhatsApp Business tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const WHATSAPP_TOOLS = [
  // Messaging
  "whatsapp_send_message",
  "whatsapp_reply_message",
  "whatsapp_send_template",
  "whatsapp_send_media",
  "whatsapp_send_reaction",
  "whatsapp_send_location",
  "whatsapp_send_contact",
  "whatsapp_send_interactive_buttons",
  "whatsapp_send_interactive_list",
  "whatsapp_mark_read",
  // Media
  "whatsapp_get_media_url",
  "whatsapp_delete_media",
  // Templates
  "whatsapp_list_templates",
  "whatsapp_get_template",
  "whatsapp_create_template",
  "whatsapp_delete_template",
  // Phone numbers
  "whatsapp_get_phone_numbers",
  "whatsapp_get_phone_number",
  // Business profile
  "whatsapp_get_profile",
  "whatsapp_update_profile",
  // Misc
  "whatsapp_get_message_status",
  "whatsapp_create_qr_code",
  "whatsapp_list_qr_codes",
] as const;


export function whatsappIntegration(config: WhatsAppIntegrationConfig = {}): MCPIntegration<"whatsapp"> {
  const oauth: OAuthConfig = {
    provider: "whatsapp",
    clientId: config.clientId ?? getEnv('WHATSAPP_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('WHATSAPP_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      businessAccountId: config.businessAccountId,
      ...config,
    },
  };

  return {
    id: "whatsapp",
    name: "WhatsApp Business",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/whatsapp.png",
    tools: [...WHATSAPP_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("WhatsApp Business integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("WhatsApp Business integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type WhatsAppTools = typeof WHATSAPP_TOOLS[number];

/**
 * Export WhatsApp client types
 */
export type { WhatsAppIntegrationClient } from "./whatsapp-client.js";
