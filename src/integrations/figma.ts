/**
 * Figma Integration
 * Enables Figma tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Figma');

/**
 * Figma integration configuration
 * 
 * SERVER-SIDE: Automatically reads FIGMA_CLIENT_ID and FIGMA_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface FigmaIntegrationConfig {
  /** Figma OAuth client ID (defaults to FIGMA_CLIENT_ID env var) */
  clientId?: string;
  /** Figma OAuth client secret (defaults to FIGMA_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['files:read', 'file_comments:write']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Figma tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const FIGMA_TOOLS = [
  "figma_get_file",
  "figma_get_file_nodes",
  "figma_get_images",
  "figma_get_comments",
  "figma_post_comment",
  "figma_list_projects",
  "figma_get_project_files",
  "figma_get_file_versions",
  "figma_get_team_components",
] as const;


export function figmaIntegration(config: FigmaIntegrationConfig = {}): MCPIntegration<"figma"> {
  const oauth: OAuthConfig = {
    provider: "figma",
    clientId: config.clientId ?? getEnv('FIGMA_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('FIGMA_CLIENT_SECRET'),
    scopes: config.scopes || ["files:read", "file_comments:write"],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "figma",
    name: "Figma",
    logoUrl: "https://cdn.simpleicons.org/figma",
    tools: [...FIGMA_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Figma integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Figma integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type FigmaTools = typeof FIGMA_TOOLS[number];

/**
 * Export Figma client types
 */
export type { FigmaIntegrationClient } from "./figma-client.js";
