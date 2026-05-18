import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Amadeus");

const AMADEUS_SCOPES = [
  "travel",
] as const;

const AMADEUS_TOOLS = [
  "amadeus_search_flights",
  "amadeus_price_flight",
  "amadeus_search_hotels",
  "amadeus_get_hotel_offers",
  "amadeus_search_locations",
] as const;

export interface AmadeusIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function amadeusIntegration(config: AmadeusIntegrationConfig = {}): MCPIntegration<"amadeus"> {
  const oauth: OAuthConfig = { provider: "amadeus", clientId: config.clientId ?? getEnv("AMADEUS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("AMADEUS_CLIENT_SECRET"), scopes: config.scopes ?? [...AMADEUS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "amadeus", name: "Amadeus", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/amadeus.png", description: "Manage Amadeus search flights, price flight, search hotels, get hotel offers, search locations", category: "Travel", tools: [...AMADEUS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Amadeus integration initialized"); },
    async onAfterConnect() { logger.debug("Amadeus integration connected"); },
  };
}

export type AmadeusTools = (typeof AMADEUS_TOOLS)[number];
export type AmadeusScopes = (typeof AMADEUS_SCOPES)[number];
export type { AmadeusIntegrationClient } from "./amadeus-client.js";
