/**
 * Google Workspace Integration
 * Enables Google Workspace tools (Sheets, Docs, Slides) with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Google Workspace');

/**
 * Google Workspace integration configuration
 * 
 * SERVER-SIDE: Automatically reads GWORKSPACE_CLIENT_ID and GWORKSPACE_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface GWorkspaceIntegrationConfig {
  /** Google Workspace OAuth client ID (defaults to GWORKSPACE_CLIENT_ID env var) */
  clientId?: string;
  /** Google Workspace OAuth client secret (defaults to GWORKSPACE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: spreadsheets, documents, presentations, drive.readonly) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Google Workspace tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const GWORKSPACE_TOOLS = [
  // Sheets tools
  "gworkspace_sheets_list",
  "gworkspace_sheets_get",
  "gworkspace_sheets_get_values",
  "gworkspace_sheets_update_values",
  "gworkspace_sheets_create",
  // Docs tools
  "gworkspace_docs_list",
  "gworkspace_docs_get",
  "gworkspace_docs_create",
  // Slides tools
  "gworkspace_slides_list",
  "gworkspace_slides_get",
  "gworkspace_slides_get_page",
  "gworkspace_slides_create",
] as const;


export function gworkspaceIntegration(config: GWorkspaceIntegrationConfig = {}): MCPIntegration<"gworkspace"> {
  const oauth: OAuthConfig = {
    provider: "gworkspace",
    clientId: config.clientId ?? getEnv('GWORKSPACE_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GWORKSPACE_CLIENT_SECRET'),
    scopes: config.scopes || [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/presentations",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "gworkspace",
    name: "Google Workspace",
    logoUrl: "https://cdn.simpleicons.org/google",
    tools: [...GWORKSPACE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Google Workspace integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Google Workspace integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type GWorkspaceTools = typeof GWORKSPACE_TOOLS[number];

/**
 * Export Google Workspace client types
 */
export type { GWorkspaceIntegrationClient } from "./gworkspace-client.js";
