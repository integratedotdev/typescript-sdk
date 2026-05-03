import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const GA4_TOOLS = [
  "ga4_batch_run_reports",
  "ga4_get_property",
  "ga4_list_account_summaries",
  "ga4_run_realtime_report",
  "ga4_run_report",
] as const;

export interface Ga4IntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function ga4Integration(config: Ga4IntegrationConfig = {}): MCPIntegration<"ga4"> {
  const oauth: OAuthConfig = {
    provider: "ga4",
    clientId: config.clientId ?? getEnv("GA4_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GA4_CLIENT_SECRET"),
    scopes: config.scopes ?? ["https://www.googleapis.com/auth/analytics.readonly"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
  };

  return {
    id: "ga4",
    name: "Google Analytics 4",
    tools: [...GA4_TOOLS],
    oauth,
  };
}

export type Ga4Tools = (typeof GA4_TOOLS)[number];
export type { Ga4IntegrationClient } from "./ga4-client.js";
