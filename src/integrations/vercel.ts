/**
 * Vercel Integration
 * Enables Vercel tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

/**
 * Vercel integration configuration
 * 
 * SERVER-SIDE: Automatically reads VERCEL_CLIENT_ID and VERCEL_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface VercelIntegrationConfig {
  /** Vercel OAuth client ID (defaults to VERCEL_CLIENT_ID env var) */
  clientId?: string;
  /** Vercel OAuth client secret (defaults to VERCEL_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Vercel tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const VERCEL_TOOLS = [
  "vercel_list_projects",
  "vercel_get_project",
  "vercel_list_deployments",
  "vercel_get_deployment",
  "vercel_create_deployment",
  "vercel_cancel_deployment",
  "vercel_list_domains",
  "vercel_list_env_vars",
  "vercel_get_deployment_logs",
] as const;


export function vercelIntegration(config: VercelIntegrationConfig = {}): MCPIntegration<"vercel"> {
  const oauth: OAuthConfig = {
    provider: "vercel",
    clientId: config.clientId ?? getEnv('VERCEL_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('VERCEL_CLIENT_SECRET'),
    scopes: config.scopes || [],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "vercel",
    tools: [...VERCEL_TOOLS],
    oauth,

    async onInit(_client) {
      console.log("Vercel integration initialized");
    },

    async onAfterConnect(_client) {
      console.log("Vercel integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type VercelTools = typeof VERCEL_TOOLS[number];

/**
 * Export Vercel client types
 */
export type { VercelIntegrationClient } from "./vercel-client.js";

