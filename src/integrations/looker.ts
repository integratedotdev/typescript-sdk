import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Looker");

const LOOKER_SCOPES = [
  "read",
  "write",
] as const;

const LOOKER_TOOLS = [
  "looker_me",
  "looker_search_dashboards",
  "looker_get_dashboard",
  "looker_run_query",
  "looker_list_looks",
  "looker_get_look",
] as const;

export interface LookerIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  looker_base_url?: string;
}

export function lookerIntegration(config: LookerIntegrationConfig = {}): MCPIntegration<"looker"> {
  const oauth: OAuthConfig = { provider: "looker", clientId: config.clientId ?? getEnv("LOOKER_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("LOOKER_CLIENT_SECRET"), scopes: config.scopes ?? [...LOOKER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "looker", name: "Looker", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/looker.png", description: "Manage Looker me, search dashboards, get dashboard, run query, list looks", category: "Data & BI", tools: [...LOOKER_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.looker_base_url) headers["X-Looker-Base-Url"] = config.looker_base_url;
      return headers;
    },
    async onInit() { logger.debug("Looker integration initialized"); },
    async onAfterConnect() { logger.debug("Looker integration connected"); },
  };
}

export type LookerTools = (typeof LOOKER_TOOLS)[number];
export type LookerScopes = (typeof LOOKER_SCOPES)[number];
export type { LookerIntegrationClient } from "./looker-client.js";
