import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("BigQuery");

const BIGQUERY_SCOPES = [
  "https://www.googleapis.com/auth/bigquery",
  "https://www.googleapis.com/auth/cloud-platform",
] as const;

const BIGQUERY_TOOLS = [
  "bigquery_list_projects",
  "bigquery_list_datasets",
  "bigquery_list_tables",
  "bigquery_get_table",
  "bigquery_query",
  "bigquery_list_jobs",
] as const;

export interface BigqueryIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function bigqueryIntegration(config: BigqueryIntegrationConfig = {}): MCPIntegration<"bigquery"> {
  const oauth: OAuthConfig = { provider: "bigquery", clientId: config.clientId ?? getEnv("BIGQUERY_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("BIGQUERY_CLIENT_SECRET"), scopes: config.scopes ?? [...BIGQUERY_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "bigquery", name: "BigQuery", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/bigquery.png", description: "Manage BigQuery list projects, list datasets, list tables, get table, query", category: "Data & BI", tools: [...BIGQUERY_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("BigQuery integration initialized"); },
    async onAfterConnect() { logger.debug("BigQuery integration connected"); },
  };
}

export type BigqueryTools = (typeof BIGQUERY_TOOLS)[number];
export type BigqueryScopes = (typeof BIGQUERY_SCOPES)[number];
export type { BigqueryIntegrationClient } from "./bigquery-client.js";
