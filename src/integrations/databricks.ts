/**
 * Databricks Integration
 * Workspace REST APIs (clusters, jobs, SQL warehouses, workspace paths) with OAuth
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Databricks");

const DATABRICKS_SCOPES = ["all-apis", "offline_access"] as const;

const DATABRICKS_TOOLS = [
  "databricks_current_user",
  "databricks_clusters_list",
  "databricks_clusters_get",
  "databricks_jobs_list",
  "databricks_jobs_get",
  "databricks_jobs_run_now",
  "databricks_sql_warehouses_list",
  "databricks_workspace_get_status",
] as const;

function normalizeDatabricksWorkspaceHost(raw?: string): string {
  const value = (raw ?? "").trim().replace(/\/+$/, "");
  if (!value) {
    return "";
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export interface DatabricksIntegrationConfig {
  /** Databricks OAuth client ID (defaults to DATABRICKS_CLIENT_ID env var) */
  clientId?: string;
  /** Databricks OAuth client secret (defaults to DATABRICKS_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
  /**
   * Workspace URL or hostname for workspace-level OIDC (e.g. https://dbc-xxxx.cloud.databricks.com).
   * Defaults to DATABRICKS_WORKSPACE_HOST. Forwarded as `subdomain` to the MCP OAuth authorize endpoint.
   */
  workspaceHost?: string;
}

export function databricksIntegration(config: DatabricksIntegrationConfig = {}): MCPIntegration<"databricks"> {
  const host = normalizeDatabricksWorkspaceHost(config.workspaceHost ?? getEnv("DATABRICKS_WORKSPACE_HOST"));
  const placeholder = "https://workspace-host.invalid";
  const base = host || placeholder;
  const oauth: OAuthConfig = {
    provider: "databricks",
    clientId: config.clientId ?? getEnv("DATABRICKS_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("DATABRICKS_CLIENT_SECRET"),
    scopes: config.scopes ?? [...DATABRICKS_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      subdomain: host || undefined,
      authorization_endpoint: `${base}/oidc/v1/authorize`,
      token_endpoint: `${base}/oidc/v1/token`,
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_method: "S256",
    },
  };

  return {
    id: "databricks",
    name: "Databricks",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/databricks.png",
    description: "Run Databricks jobs, list clusters and SQL warehouses, and inspect workspace paths",
    category: "Engineering",
    tools: [...DATABRICKS_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Databricks integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Databricks integration connected");
    },
  };
}

export type DatabricksTools = (typeof DATABRICKS_TOOLS)[number];
export type DatabricksScopes = (typeof DATABRICKS_SCOPES)[number];

export type { DatabricksIntegrationClient } from "./databricks-client.js";
