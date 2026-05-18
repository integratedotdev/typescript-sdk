import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Expedia Rapid");

const EXPEDIA_SCOPES = [
  "rapid",
] as const;

const EXPEDIA_TOOLS = [
  "expedia_search_properties",
  "expedia_get_property_content",
  "expedia_get_rate_quote",
  "expedia_create_booking",
  "expedia_get_itinerary",
] as const;

export interface ExpediaIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function expediaIntegration(config: ExpediaIntegrationConfig = {}): MCPIntegration<"expedia"> {
  const oauth: OAuthConfig = { provider: "expedia", clientId: config.clientId ?? getEnv("EXPEDIA_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("EXPEDIA_CLIENT_SECRET"), scopes: config.scopes ?? [...EXPEDIA_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "expedia", name: "Expedia Rapid", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/expedia.png", description: "Manage Expedia Rapid search properties, get property content, get rate quote, create booking, get itinerary", category: "Travel", tools: [...EXPEDIA_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Expedia Rapid integration initialized"); },
    async onAfterConnect() { logger.debug("Expedia Rapid integration connected"); },
  };
}

export type ExpediaTools = (typeof EXPEDIA_TOOLS)[number];
export type ExpediaScopes = (typeof EXPEDIA_SCOPES)[number];
export type { ExpediaIntegrationClient } from "./expedia-client.js";
