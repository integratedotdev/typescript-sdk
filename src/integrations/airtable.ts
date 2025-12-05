/**
 * Airtable Integration
 * Enables Airtable tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

/**
 * Airtable integration configuration
 * 
 * SERVER-SIDE: Automatically reads AIRTABLE_CLIENT_ID and AIRTABLE_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface AirtableIntegrationConfig {
  /** Airtable OAuth client ID (defaults to AIRTABLE_CLIENT_ID env var) */
  clientId?: string;
  /** Airtable OAuth client secret (defaults to AIRTABLE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['data.records:read', 'data.records:write', 'schema.bases:read']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Airtable tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const AIRTABLE_TOOLS = [
  "airtable_list_bases",
  "airtable_get_base",
  "airtable_list_tables",
  "airtable_get_table",
  "airtable_list_records",
  "airtable_get_record",
  "airtable_create_record",
  "airtable_update_record",
  "airtable_search_records",
] as const;


export function airtableIntegration(config: AirtableIntegrationConfig = {}): MCPIntegration<"airtable"> {
  const oauth: OAuthConfig = {
    provider: "airtable",
    clientId: config.clientId ?? getEnv('AIRTABLE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('AIRTABLE_CLIENT_SECRET'),
    scopes: config.scopes || ["data.records:read", "data.records:write", "schema.bases:read"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "airtable",
    tools: [...AIRTABLE_TOOLS],
    oauth,

    async onInit(_client) {
      console.log("Airtable integration initialized");
    },

    async onAfterConnect(_client) {
      console.log("Airtable integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type AirtableTools = typeof AIRTABLE_TOOLS[number];

/**
 * Export Airtable client types
 */
export type { AirtableIntegrationClient } from "./airtable-client.js";

