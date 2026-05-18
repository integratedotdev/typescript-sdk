import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Meetup");

const MEETUP_SCOPES = [
  "basic",
  "event_management",
  "group_edit",
  "rsvp",
] as const;

const MEETUP_TOOLS = [
  "meetup_get_self",
  "meetup_search_groups",
  "meetup_list_events",
  "meetup_get_event",
  "meetup_create_event",
  "meetup_rsvp_event",
] as const;

export interface MeetupIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function meetupIntegration(config: MeetupIntegrationConfig = {}): MCPIntegration<"meetup"> {
  const oauth: OAuthConfig = { provider: "meetup", clientId: config.clientId ?? getEnv("MEETUP_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MEETUP_CLIENT_SECRET"), scopes: config.scopes ?? [...MEETUP_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "meetup", name: "Meetup", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/meetup.png", description: "Manage Meetup get self, search groups, list events, get event, create event", category: "Events & Ticketing", tools: [...MEETUP_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Meetup integration initialized"); },
    async onAfterConnect() { logger.debug("Meetup integration connected"); },
  };
}

export type MeetupTools = (typeof MEETUP_TOOLS)[number];
export type MeetupScopes = (typeof MEETUP_SCOPES)[number];
export type { MeetupIntegrationClient } from "./meetup-client.js";
