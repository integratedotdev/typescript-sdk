import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Universe");

const UNIVERSE_SCOPES = [
  "read",
  "write",
] as const;

const UNIVERSE_TOOLS = [
  "universe_get_user",
  "universe_list_events",
  "universe_get_event",
  "universe_create_event",
  "universe_list_orders",
  "universe_list_attendees",
] as const;

export interface UniverseIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function universeIntegration(config: UniverseIntegrationConfig = {}): MCPIntegration<"universe"> {
  const oauth: OAuthConfig = { provider: "universe", clientId: config.clientId ?? getEnv("UNIVERSE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("UNIVERSE_CLIENT_SECRET"), scopes: config.scopes ?? [...UNIVERSE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "universe", name: "Universe", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/universe.png", description: "Manage Universe get user, list events, get event, create event, list orders", category: "Events & Ticketing", tools: [...UNIVERSE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Universe integration initialized"); },
    async onAfterConnect() { logger.debug("Universe integration connected"); },
  };
}

export type UniverseTools = (typeof UNIVERSE_TOOLS)[number];
export type UniverseScopes = (typeof UNIVERSE_SCOPES)[number];
export type { UniverseIntegrationClient } from "./universe-client.js";
