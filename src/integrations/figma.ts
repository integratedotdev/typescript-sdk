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
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default Figma tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const FIGMA_TOOLS = [
  // Files
  "figma_get_file",
  "figma_get_file_nodes",
  "figma_get_file_meta",
  "figma_get_image_fills",
  "figma_get_images",
  "figma_get_file_versions",
  "figma_get_oembed",
  // Users
  "figma_get_me",
  // Comments
  "figma_get_comments",
  "figma_post_comment",
  "figma_delete_comment",
  "figma_get_comment_reactions",
  "figma_post_comment_reaction",
  "figma_delete_comment_reaction",
  // Projects
  "figma_list_projects",
  "figma_get_project_files",
  // Components
  "figma_get_team_components",
  "figma_get_file_components",
  "figma_get_component",
  "figma_get_team_component_sets",
  "figma_get_file_component_sets",
  "figma_get_component_set",
  // Styles
  "figma_get_team_styles",
  "figma_get_file_styles",
  "figma_get_style",
  // Webhooks
  "figma_list_webhooks",
  "figma_create_webhook",
  "figma_get_webhook",
  "figma_update_webhook",
  "figma_delete_webhook",
  "figma_get_team_webhooks",
  "figma_get_webhook_requests",
  // Variables
  "figma_get_local_variables",
  "figma_get_published_variables",
  "figma_post_variables",
  // Dev Resources
  "figma_get_dev_resources",
  "figma_post_dev_resources",
  "figma_put_dev_resources",
  "figma_delete_dev_resource",
  // Payments
  "figma_get_payments",
  // Library Analytics
  "figma_get_library_analytics_component_actions",
  "figma_get_library_analytics_component_usages",
  "figma_get_library_analytics_style_actions",
  "figma_get_library_analytics_style_usages",
] as const;


export function figmaIntegration(config: FigmaIntegrationConfig = {}): MCPIntegration<"figma"> {
  const oauth: OAuthConfig = {
    provider: "figma",
    clientId: config.clientId ?? getEnv('FIGMA_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('FIGMA_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "figma",
    name: "Figma",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/figma.png",
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
