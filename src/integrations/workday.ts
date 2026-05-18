/**
 * Workday Integration
 * Tenant-scoped OAuth and REST tools for Workday HCM
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Workday");

const WORKDAY_TOOLS = [
  "workday_list_workers",
  "workday_get_worker",
] as const;

export interface WorkdayIntegrationConfig {
  /** Workday OAuth client ID (defaults to WORKDAY_CLIENT_ID) */
  clientId?: string;
  /** Workday OAuth client secret (defaults to WORKDAY_CLIENT_SECRET) */
  clientSecret?: string;
  /** OAuth scopes (configure in Workday API Client; often empty or custom) */
  scopes?: string[];
  redirectUri?: string;
  /**
   * Tenant descriptor for OAuth: "hostname|tenant" from your Workday API Client page
   * (e.g. "wd5-services1.workday.com|mycompany_dpt1"). Forwarded as `subdomain` to the MCP OAuth layer.
   */
  subdomain?: string;
}

export function workdayIntegration(config: WorkdayIntegrationConfig = {}): MCPIntegration<"workday"> {
  const oauth: OAuthConfig = {
    provider: "workday",
    clientId: config.clientId ?? getEnv("WORKDAY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("WORKDAY_CLIENT_SECRET"),
    scopes: config.scopes,
    redirectUri: config.redirectUri,
    config: {
      subdomain: config.subdomain ?? getEnv("WORKDAY_TENANT_DESCRIPTOR"),
    },
  };

  return {
    id: "workday",
    name: "Workday",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/workday.png",
    description: "Query Workday workers via the tenant REST API",
    category: "HR & Recruiting",
    tools: [...WORKDAY_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Workday integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Workday integration connected");
    },
  };
}

export type WorkdayTools = (typeof WORKDAY_TOOLS)[number];

export type { WorkdayIntegrationClient } from "./workday-client.js";
