import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Snowflake");

const SNOWFLAKE_SCOPES = [
  "session:role-any",
] as const;

const SNOWFLAKE_TOOLS = [
  "snowflake_submit_statement",
  "snowflake_get_statement",
  "snowflake_cancel_statement",
  "snowflake_list_databases",
  "snowflake_list_warehouses",
] as const;

export interface SnowflakeIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  account?: string;
}

export function snowflakeIntegration(config: SnowflakeIntegrationConfig = {}): MCPIntegration<"snowflake"> {
  const oauth: OAuthConfig = { provider: "snowflake", clientId: config.clientId ?? getEnv("SNOWFLAKE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("SNOWFLAKE_CLIENT_SECRET"), scopes: config.scopes ?? [...SNOWFLAKE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "snowflake", name: "Snowflake", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/snowflake.png", description: "Manage Snowflake submit statement, get statement, cancel statement, list databases, list warehouses", category: "Data & BI", tools: [...SNOWFLAKE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.account) headers["X-Snowflake-Account"] = config.account;
      return headers;
    },
    async onInit() { logger.debug("Snowflake integration initialized"); },
    async onAfterConnect() { logger.debug("Snowflake integration connected"); },
  };
}

export type SnowflakeTools = (typeof SNOWFLAKE_TOOLS)[number];
export type SnowflakeScopes = (typeof SNOWFLAKE_SCOPES)[number];
export type { SnowflakeIntegrationClient } from "./snowflake-client.js";
