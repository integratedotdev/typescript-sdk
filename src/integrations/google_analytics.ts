import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const GOOGLE_ANALYTICS_TOOLS = [
  "google_analytics_batch_run_reports",
  "google_analytics_get_property",
  "google_analytics_list_account_summaries",
  "google_analytics_run_realtime_report",
  "google_analytics_run_report",
] as const;

export interface GoogleAnalyticsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function googleAnalyticsIntegration(config: GoogleAnalyticsIntegrationConfig = {}): MCPIntegration<"google_analytics"> {
  const oauth: OAuthConfig = {
    provider: "google_analytics",
    clientId: config.clientId ?? getEnv("GOOGLE_ANALYTICS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GOOGLE_ANALYTICS_CLIENT_SECRET"),
    scopes: config.scopes ?? ["https://www.googleapis.com/auth/analytics.readonly"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
  };

  return {
    id: "google_analytics",
    name: "Google Analytics",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_analytics.png",
    tools: [...GOOGLE_ANALYTICS_TOOLS],
    oauth,
  };
}

export type GoogleAnalyticsTools = (typeof GOOGLE_ANALYTICS_TOOLS)[number];
export type { GoogleAnalyticsIntegrationClient } from "./google_analytics-client.js";
