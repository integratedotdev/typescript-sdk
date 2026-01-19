/**
 * Cursor Integration
 * Enables Cursor tools with basic authentication
 */

import type { MCPIntegration } from "./types.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Cursor');

/**
 * Cursor integration configuration
 * 
 * Cursor uses basic authentication with an API key.
 * Set CURSOR_API_KEY environment variable or pass apiKey directly.
 */
export interface CursorIntegrationConfig {
  /** Cursor API key (defaults to CURSOR_API_KEY env var) */
  apiKey?: string;
}

/**
 * Default Cursor tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const CURSOR_TOOLS = [
  "cursor_list_agents",
  "cursor_get_agent",
  "cursor_get_conversation",
  "cursor_launch_agent",
  "cursor_followup_agent",
  "cursor_stop_agent",
  "cursor_delete_agent",
  "cursor_get_me",
  "cursor_list_models",
  "cursor_list_repositories",
] as const;


export function cursorIntegration(_config: CursorIntegrationConfig = {}): MCPIntegration<"cursor"> {
  return {
    id: "cursor",
    name: "Cursor",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/cursor.jpeg",
    tools: [...CURSOR_TOOLS],
    // No OAuth - Cursor uses basic authentication with API key

    async onInit(_client) {
      logger.debug("Cursor integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Cursor integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type CursorTools = typeof CURSOR_TOOLS[number];

/**
 * Export Cursor client types
 */
export type { CursorIntegrationClient } from "./cursor-client.js";
