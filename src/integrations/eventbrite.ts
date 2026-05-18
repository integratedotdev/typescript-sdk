import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Eventbrite");

const EVENTBRITE_SCOPES = [
  "eventbrite",
] as const;

const EVENTBRITE_TOOLS = [
  "eventbrite_get_user",
  "eventbrite_list_organizations",
  "eventbrite_list_events",
  "eventbrite_get_event",
  "eventbrite_create_event",
  "eventbrite_list_attendees",
] as const;

export interface EventbriteIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function eventbriteIntegration(config: EventbriteIntegrationConfig = {}): MCPIntegration<"eventbrite"> {
  const oauth: OAuthConfig = { provider: "eventbrite", clientId: config.clientId ?? getEnv("EVENTBRITE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("EVENTBRITE_CLIENT_SECRET"), scopes: config.scopes ?? [...EVENTBRITE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "eventbrite", name: "Eventbrite", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/eventbrite.png", description: "Manage Eventbrite get user, list organizations, list events, get event, create event", category: "Events & Ticketing", tools: [...EVENTBRITE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Eventbrite integration initialized"); },
    async onAfterConnect() { logger.debug("Eventbrite integration connected"); },
  };
}

export type EventbriteTools = (typeof EVENTBRITE_TOOLS)[number];
export type EventbriteScopes = (typeof EVENTBRITE_SCOPES)[number];
export type { EventbriteIntegrationClient } from "./eventbrite-client.js";
