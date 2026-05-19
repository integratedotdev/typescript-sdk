import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Microsoft To Do");

const MICROSOFT_TO_DO_SCOPES = [
  "offline_access",
  "User.Read",
  "Tasks.ReadWrite",
] as const;

const MICROSOFT_TO_DO_TOOLS = [
  "microsoft_to_do_list_task_lists",
  "microsoft_to_do_get_task_list",
  "microsoft_to_do_create_task_list",
  "microsoft_to_do_list_tasks",
  "microsoft_to_do_get_task",
  "microsoft_to_do_create_task",
  "microsoft_to_do_update_task",
] as const;

export interface MicrosoftToDoIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function microsoftToDoIntegration(config: MicrosoftToDoIntegrationConfig = {}): MCPIntegration<"microsoft_to_do"> {
  const oauth: OAuthConfig = { provider: "microsoft_to_do", clientId: config.clientId ?? getEnv("MICROSOFT_TO_DO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MICROSOFT_TO_DO_CLIENT_SECRET"), scopes: config.scopes ?? [...MICROSOFT_TO_DO_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "microsoft_to_do", name: "Microsoft To Do", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/microsoft_to_do.png", description: "Manage Microsoft To Do task lists and tasks through Microsoft Graph", category: "Productivity", tools: [...MICROSOFT_TO_DO_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Microsoft To Do integration initialized"); },
    async onAfterConnect() { logger.debug("Microsoft To Do integration connected"); },
  };
}

export type MicrosoftToDoTools = (typeof MICROSOFT_TO_DO_TOOLS)[number];
export type MicrosoftToDoScopes = (typeof MICROSOFT_TO_DO_SCOPES)[number];
export type { MicrosoftToDoIntegrationClient } from "./microsoft_to_do-client.js";
