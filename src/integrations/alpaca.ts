/**
 * Alpaca Integration
 * Stock and crypto trading via Alpaca Trading API (API key ID + secret)
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Alpaca");

const ALPACA_TOOLS = [
  "alpaca_get_account",
  "alpaca_list_positions",
  "alpaca_get_position",
  "alpaca_list_orders",
  "alpaca_get_order",
  "alpaca_create_order",
  "alpaca_cancel_order",
  "alpaca_cancel_all_orders",
  "alpaca_get_clock",
  "alpaca_get_calendar",
  "alpaca_list_assets",
  "alpaca_get_asset",
  "alpaca_get_portfolio_history",
] as const;

export type AlpacaEnvironment = "paper" | "live";

export interface AlpacaIntegrationOptions {
  /** Alpaca API key ID (defaults to ALPACA_API_KEY_ID) */
  apiKeyId?: string;
  /** Alpaca secret key (defaults to ALPACA_API_SECRET_KEY) */
  apiSecretKey?: string;
  /**
   * paper uses https://paper-api.alpaca.markets (default).
   * live uses https://api.alpaca.markets — only use with live-trading keys.
   */
  environment?: AlpacaEnvironment;
}

export function alpacaIntegration(options: AlpacaIntegrationOptions = {}): MCPIntegration<"alpaca"> {
  const apiKeyId = options.apiKeyId ?? getEnv("ALPACA_API_KEY_ID");
  const apiSecretKey = options.apiSecretKey ?? getEnv("ALPACA_API_SECRET_KEY");
  if (!apiKeyId || !apiSecretKey) {
    throw new Error(
      "alpacaIntegration requires apiKeyId and apiSecretKey (or ALPACA_API_KEY_ID and ALPACA_API_SECRET_KEY)"
    );
  }

  const environment: AlpacaEnvironment = options.environment ?? "paper";

  return {
    id: "alpaca",
    name: "Alpaca",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/alpaca.png",
    description: "Trade US equities and crypto with Alpaca: account, orders, positions, clock, and assets",
    category: "Finance",
    tools: [...ALPACA_TOOLS],
    authType: "apiKey",
    getHeaders() {
      const headers: Record<string, string> = {
        "APCA-API-KEY-ID": apiKeyId,
        "APCA-API-SECRET-KEY": apiSecretKey,
      };
      if (environment === "live") {
        headers["X-Integrate-Alpaca-Environment"] = "live";
      }
      return headers;
    },

    async onInit(_client) {
      logger.debug("Alpaca integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Alpaca integration connected");
    },
  };
}

export type AlpacaTools = (typeof ALPACA_TOOLS)[number];

export type { AlpacaIntegrationClient } from "./alpaca-client.js";
