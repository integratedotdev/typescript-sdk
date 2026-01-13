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
  "whatsapp_send_message",
  "whatsapp_send_template",
  "whatsapp_send_media",
  "whatsapp_list_templates",
  "whatsapp_get_phone_numbers",
  "whatsapp_get_message_status",
  "whatsapp_mark_read",
  "whatsapp_get_profile",
] as const;


export function whatsappIntegration(config: WhatsAppIntegrationConfig = {}): MCPIntegration<"whatsapp"> {
  const oauth: OAuthConfig = {
    provider: "whatsapp",
    clientId: config.clientId ?? getEnv('WHATSAPP_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('WHATSAPP_CLIENT_SECRET'),
    scopes: config.scopes || ["business_management", "whatsapp_business_messaging", "whatsapp_business_management"],
    redirectUri: config.redirectUri,
    config: {
      businessAccountId: config.businessAccountId,
      ...config,
    },
  };

  return {
    id: "whatsapp",
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
