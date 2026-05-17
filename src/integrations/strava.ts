import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Strava");

const STRAVA_SCOPES = [
  "read",
  "profile:read_all",
  "profile:write",
  "activity:read",
  "activity:read_all",
  "activity:write",
] as const;

const STRAVA_TOOLS = [
  "strava_get_logged_in_athlete",
  "strava_update_logged_in_athlete",
  "strava_get_athlete_stats",
  "strava_list_athlete_activities",
  "strava_get_activity",
  "strava_create_activity",
  "strava_update_activity",
  "strava_delete_activity",
  "strava_get_activity_streams",
  "strava_list_athlete_routes",
  "strava_get_route",
  "strava_export_route_gpx",
  "strava_list_athlete_clubs",
  "strava_get_club",
  "strava_list_club_activities",
  "strava_list_club_members",
  "strava_get_segment",
  "strava_explore_segments",
  "strava_get_segment_leaderboard",
  "strava_list_starred_segments",
  "strava_star_segment",
  "strava_get_gear",
  "strava_get_upload",
  "strava_create_upload",
] as const;

export interface StravaIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function stravaIntegration(config: StravaIntegrationConfig = {}): MCPIntegration<"strava"> {
  const oauth: OAuthConfig = {
    provider: "strava",
    clientId: config.clientId ?? getEnv("STRAVA_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("STRAVA_CLIENT_SECRET"),
    scopes: config.scopes ?? [...STRAVA_SCOPES],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "strava",
    name: "Strava",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/strava.png",
    description: "Manage Strava athletes, activities, routes, clubs, segments, streams, gear, and uploads",
    category: "Other",
    tools: [...STRAVA_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Strava integration initialized"); },
    async onAfterConnect() { logger.debug("Strava integration connected"); },
  };
}

export type StravaTools = (typeof STRAVA_TOOLS)[number];
export type StravaScopes = (typeof STRAVA_SCOPES)[number];
export type { StravaIntegrationClient } from "./strava-client.js";

