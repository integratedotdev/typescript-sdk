import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Tableau");

const TABLEAU_SCOPES = [
  "tableau:content:read",
  "tableau:content:write",
  "tableau:users:read",
] as const;

const TABLEAU_TOOLS = [
  "tableau_list_sites",
  "tableau_list_workbooks",
  "tableau_get_workbook",
  "tableau_list_views",
  "tableau_list_datasources",
  "tableau_run_query_view_data",
] as const;

export interface TableauIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  tableau_base_url?: string;
}

export function tableauIntegration(config: TableauIntegrationConfig = {}): MCPIntegration<"tableau"> {
  const oauth: OAuthConfig = { provider: "tableau", clientId: config.clientId ?? getEnv("TABLEAU_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("TABLEAU_CLIENT_SECRET"), scopes: config.scopes ?? [...TABLEAU_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "tableau", name: "Tableau", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tableau.png", description: "Manage Tableau list sites, list workbooks, get workbook, list views, list datasources", category: "Data & BI", tools: [...TABLEAU_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.tableau_base_url) headers["X-Tableau-Base-Url"] = config.tableau_base_url;
      return headers;
    },
    async onInit() { logger.debug("Tableau integration initialized"); },
    async onAfterConnect() { logger.debug("Tableau integration connected"); },
  };
}

export type TableauTools = (typeof TABLEAU_TOOLS)[number];
export type TableauScopes = (typeof TABLEAU_SCOPES)[number];
export type { TableauIntegrationClient } from "./tableau-client.js";
