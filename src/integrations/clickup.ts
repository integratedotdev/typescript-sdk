import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("ClickUp");

const CLICKUP_TOOLS = [
  "clickup_get_authorized_user",
  "clickup_list_teams",
  "clickup_list_spaces",
  "clickup_list_folders",
  "clickup_list_lists_in_folder",
  "clickup_list_folderless_lists",
  "clickup_list_tasks",
  "clickup_get_task",
  "clickup_create_task",
  "clickup_update_task",
  "clickup_delete_task",
  "clickup_list_task_comments",
  "clickup_create_task_comment",
] as const;

export interface ClickUpIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function clickupIntegration(config: ClickUpIntegrationConfig = {}): MCPIntegration<"clickup"> {
  const oauth: OAuthConfig = {
    provider: "clickup",
    clientId: config.clientId ?? getEnv("CLICKUP_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("CLICKUP_CLIENT_SECRET"),
    scopes: config.scopes ?? [],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://app.clickup.com/api",
      token_endpoint: "https://api.clickup.com/api/v2/oauth/token",
    },
  };

  return {
    id: "clickup",
    name: "ClickUp",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/clickup.png",
    tools: [...CLICKUP_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("ClickUp integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("ClickUp integration connected");
    },
  };
}

export type ClickUpTools = (typeof CLICKUP_TOOLS)[number];
export type { ClickUpIntegrationClient } from "./clickup-client.js";
