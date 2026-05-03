/**
 * Monday.com Integration
 * GraphQL API for boards, items, and updates
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Monday");

const MONDAY_TOOLS = [
  "monday_me",
  "monday_list_workspaces",
  "monday_list_boards",
  "monday_get_board",
  "monday_list_board_items",
  "monday_next_items_page",
  "monday_get_items",
  "monday_create_item",
  "monday_update_item_columns",
  "monday_create_update",
  "monday_delete_item",
] as const;

export interface MondayIntegrationConfig {
  /** OAuth client ID (defaults to MONDAY_CLIENT_ID) */
  clientId?: string;
  /** OAuth client secret (defaults to MONDAY_CLIENT_SECRET) */
  clientSecret?: string;
  /** Scopes configured on your monday.com app (optional) */
  scopes?: string[];
  redirectUri?: string;
}

export function mondayIntegration(config: MondayIntegrationConfig = {}): MCPIntegration<"monday"> {
  const oauth: OAuthConfig = {
    provider: "monday",
    clientId: config.clientId ?? getEnv("MONDAY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("MONDAY_CLIENT_SECRET"),
    scopes: config.scopes ?? [],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://auth.monday.com/oauth2/authorize",
      token_endpoint: "https://auth.monday.com/oauth2/token",
      response_type: "code",
      grant_types_supported: ["authorization_code"],
    },
  };

  return {
    id: "monday",
    name: "Monday.com",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/monday.png",
    description: "Manage Monday.com boards, items, columns, and updates",
    category: "Productivity",
    tools: [...MONDAY_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Monday.com integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Monday.com integration connected");
    },
  };
}

export type MondayTools = (typeof MONDAY_TOOLS)[number];

export type { MondayIntegrationClient } from "./monday-client.js";
