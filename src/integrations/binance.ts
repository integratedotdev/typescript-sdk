/**
 * Binance Spot integration — read-only market and account tools using API key + secret.
 * Use keys with “Enable Reading” only; never enable withdrawals or trading unless required.
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Binance");

const BINANCE_TOOLS = [
  "binance_ping",
  "binance_get_server_time",
  "binance_get_exchange_info",
  "binance_get_ticker_price",
  "binance_get_ticker_24hr",
  "binance_get_order_book",
  "binance_get_recent_trades",
  "binance_get_klines",
  "binance_get_account",
  "binance_get_open_orders",
  "binance_get_all_orders",
  "binance_get_my_trades",
] as const;

export interface BinanceIntegrationOptions {
  /** Binance API key (defaults to BINANCE_API_KEY) */
  apiKey?: string;
  /** Binance secret key for request signing (defaults to BINANCE_SECRET_KEY) */
  secret?: string;
  /**
   * Spot REST API origin.
   * @default "https://api.binance.com"
   * Spot testnet: https://testnet.binance.vision
   */
  baseUrl?: string;
}

function normalizeBaseUrl(url: string | undefined): string {
  const u = (url ?? "").trim().replace(/\/+$/, "");
  return u || "https://api.binance.com";
}

export function binanceIntegration(options: BinanceIntegrationOptions = {}): MCPIntegration<"binance"> {
  const apiKey = options.apiKey ?? getEnv("BINANCE_API_KEY");
  const secret = options.secret ?? getEnv("BINANCE_SECRET_KEY");
  if (!apiKey || !secret) {
    throw new Error(
      "binanceIntegration requires apiKey and secret (or BINANCE_API_KEY and BINANCE_SECRET_KEY environment variables)"
    );
  }

  const baseUrl = normalizeBaseUrl(options.baseUrl);

  return {
    id: "binance",
    name: "Binance",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/binance.png",
    description:
      "Read Binance Spot market data and account information with API keys scoped to reading only",
    category: "Finance",
    tools: [...BINANCE_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiKey}`,
        "X-MBX-APIKEY": apiKey,
        "X-Binance-Api-Secret": secret,
        "X-Binance-Base-Url": baseUrl,
      };
    },

    async onInit(_client) {
      logger.debug("Binance integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Binance integration connected");
    },
  };
}

export type BinanceTools = (typeof BINANCE_TOOLS)[number];

export type { BinanceIntegrationClient } from "./binance-client.js";
