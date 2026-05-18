import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Foursquare");

const FOURSQUARE_SCOPES = [
  "places",
  "tips",
  "photos",
] as const;

const FOURSQUARE_TOOLS = [
  "foursquare_search_places",
  "foursquare_get_place",
  "foursquare_get_place_tips",
  "foursquare_get_place_photos",
  "foursquare_autocomplete_places",
] as const;

export interface FoursquareIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function foursquareIntegration(config: FoursquareIntegrationConfig = {}): MCPIntegration<"foursquare"> {
  const oauth: OAuthConfig = { provider: "foursquare", clientId: config.clientId ?? getEnv("FOURSQUARE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FOURSQUARE_CLIENT_SECRET"), scopes: config.scopes ?? [...FOURSQUARE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "foursquare", name: "Foursquare", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/foursquare.png", description: "Manage Foursquare search places, get place, get place tips, get place photos, autocomplete places", category: "Food", tools: [...FOURSQUARE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Foursquare integration initialized"); },
    async onAfterConnect() { logger.debug("Foursquare integration connected"); },
  };
}

export type FoursquareTools = (typeof FOURSQUARE_TOOLS)[number];
export type FoursquareScopes = (typeof FOURSQUARE_SCOPES)[number];
export type { FoursquareIntegrationClient } from "./foursquare-client.js";
