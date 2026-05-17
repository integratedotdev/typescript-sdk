import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Asana");

const ASANA_TOOLS = [
  "asana_get_current_user",
  "asana_list_workspaces",
  "asana_list_projects",
  "asana_get_project",
  "asana_create_project",
  "asana_update_project",
  "asana_list_sections",
  "asana_list_tasks",
  "asana_get_task",
  "asana_create_task",
  "asana_update_task",
  "asana_delete_task",
  "asana_list_stories",
  "asana_create_story",
  "asana_list_users",
  "asana_list_teams",
] as const;

export interface AsanaIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function asanaIntegration(config: AsanaIntegrationConfig = {}): MCPIntegration<"asana"> {
  const oauth: OAuthConfig = {
    provider: "asana",
    clientId: config.clientId ?? getEnv("ASANA_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("ASANA_CLIENT_SECRET"),
    scopes: config.scopes ?? ["default"],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "asana",
    name: "Asana",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/asana.png",
    description: "Manage Asana workspaces, projects, sections, tasks, stories, users, and teams",
    category: "Productivity",
    tools: [...ASANA_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Asana integration initialized"); },
    async onAfterConnect() { logger.debug("Asana integration connected"); },
  };
}

export type AsanaTools = (typeof ASANA_TOOLS)[number];
export type { AsanaIntegrationClient } from "./asana-client.js";

