/**
 * Telegram Integration
 * User-account MTProto integration. Telegram does not expose OAuth for full
 * user API access; use api_id/api_hash plus an authorized session.
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Telegram");

export interface TelegramIntegrationOptions {
  /** Telegram application api_id from https://my.telegram.org/apps */
  apiId?: number | string;
  /** Telegram application api_hash from https://my.telegram.org/apps */
  apiHash?: string;
  /** Stable server-side session id. Required after auth unless TELEGRAM_SESSION_ID is set on the MCP server. */
  sessionId?: string;
}

const TELEGRAM_TOOLS = [
  "telegram_auth_send_code",
  "telegram_auth_sign_in",
  "telegram_auth_check_password",
  "telegram_get_me",
  "telegram_resolve_username",
  "telegram_list_dialogs",
  "telegram_get_history",
  "telegram_search_messages",
  "telegram_send_message",
] as const;

export function telegramIntegration(options: TelegramIntegrationOptions = {}): MCPIntegration<"telegram"> {
  const apiId = options.apiId ?? getEnv("TELEGRAM_API_ID");
  const apiHash = options.apiHash ?? getEnv("TELEGRAM_API_HASH");
  const sessionId = options.sessionId ?? getEnv("TELEGRAM_SESSION_ID");

  if (!apiId) {
    throw new Error("telegramIntegration requires apiId or TELEGRAM_API_ID");
  }
  if (!apiHash) {
    throw new Error("telegramIntegration requires apiHash or TELEGRAM_API_HASH");
  }

  return {
    id: "telegram",
    name: "Telegram",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/telegram.png",
    description: "Use Telegram as an actual user account via MTProto sessions, not the Bot API",
    category: "Communication",
    tools: [...TELEGRAM_TOOLS],
    authType: "apiKey",
    getHeaders() {
      const headers: Record<string, string> = {
        "X-Telegram-Api-Id": String(apiId),
        "X-Telegram-Api-Hash": String(apiHash),
      };
      if (sessionId) {
        headers["X-Telegram-Session-Id"] = sessionId;
      }
      return headers;
    },

    async onInit(_client) {
      logger.debug("Telegram integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Telegram integration connected");
    },
  };
}

export type TelegramTools = (typeof TELEGRAM_TOOLS)[number];

export type { TelegramIntegrationClient } from "./telegram-client.js";
