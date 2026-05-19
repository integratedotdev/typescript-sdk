import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Calendly");

const CALENDLY_SCOPES = [
  "user:read",
  "event_types:read",
  "scheduled_events:read",
  "organization_memberships:read",
  "routing:read",
] as const;

const CALENDLY_TOOLS = [
  "calendly_get_current_user",
  "calendly_list_event_types",
  "calendly_get_event_type",
  "calendly_list_scheduled_events",
  "calendly_get_scheduled_event",
  "calendly_list_scheduled_event_invitees",
  "calendly_list_availability_schedules",
] as const;

export interface CalendlyIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function calendlyIntegration(config: CalendlyIntegrationConfig = {}): MCPIntegration<"calendly"> {
  const oauth: OAuthConfig = { provider: "calendly", clientId: config.clientId ?? getEnv("CALENDLY_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("CALENDLY_CLIENT_SECRET"), scopes: config.scopes ?? [...CALENDLY_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "calendly", name: "Calendly", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/calendly.png", description: "Manage Calendly user profiles, event types, scheduled events, invitees, and availability schedules", category: "Scheduling", tools: [...CALENDLY_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Calendly integration initialized"); },
    async onAfterConnect() { logger.debug("Calendly integration connected"); },
  };
}

export type CalendlyTools = (typeof CALENDLY_TOOLS)[number];
export type CalendlyScopes = (typeof CALENDLY_SCOPES)[number];
export type { CalendlyIntegrationClient } from "./calendly-client.js";
