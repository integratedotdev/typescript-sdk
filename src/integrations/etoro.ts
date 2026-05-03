import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("eToro");

const ETORO_TOOLS = [
  "etoro_get_identity",
  "etoro_get_portfolio",
  "etoro_search_instruments",
  "etoro_get_instrument_rates",
  "etoro_list_trade_history",
  "etoro_list_watchlists",
] as const;

export interface EtoroIntegrationOptions {
  publicApiKey?: string;
  userKey?: string;
}

export function etoroIntegration(options: EtoroIntegrationOptions = {}): MCPIntegration<"etoro"> {
  const publicApiKey = options.publicApiKey ?? getEnv("ETORO_PUBLIC_API_KEY");
  const userKey = options.userKey ?? getEnv("ETORO_USER_KEY");
  if (!publicApiKey || !userKey) {
    throw new Error("etoroIntegration requires publicApiKey/userKey or ETORO_PUBLIC_API_KEY/ETORO_USER_KEY");
  }

  return {
    id: "etoro",
    name: "eToro",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/etoro.png",
    description: "Access eToro Public API identity, portfolio, market data, trade history, and watchlists",
    category: "Finance",
    tools: [...ETORO_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        "X-Api-Key": publicApiKey,
        "X-User-Key": userKey,
      };
    },
    async onInit(_client) {
      logger.debug("eToro integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("eToro integration connected");
    },
  };
}

export type EtoroTools = (typeof ETORO_TOOLS)[number];
export type { EtoroIntegrationClient } from "./etoro-client.js";
