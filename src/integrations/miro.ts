import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Miro");

const MIRO_SCOPES = [
  "boards:read",
  "boards:write",
  "identity:read",
  "team:read",
] as const;

const MIRO_TOOLS = [
  "miro_get_current_user",
  "miro_list_boards",
  "miro_get_board",
  "miro_create_board",
  "miro_list_board_items",
  "miro_create_board_item",
  "miro_list_comments",
  "miro_list_board_members",
] as const;

export interface MiroIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function miroIntegration(config: MiroIntegrationConfig = {}): MCPIntegration<"miro"> {
  const oauth: OAuthConfig = { provider: "miro", clientId: config.clientId ?? getEnv("MIRO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MIRO_CLIENT_SECRET"), scopes: config.scopes ?? [...MIRO_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "miro", name: "Miro", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/miro.png", description: "Manage Miro boards, board items, comments, members, and collaborators", category: "Productivity", tools: [...MIRO_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Miro integration initialized"); },
    async onAfterConnect() { logger.debug("Miro integration connected"); },
  };
}

export type MiroTools = (typeof MIRO_TOOLS)[number];
export type MiroScopes = (typeof MIRO_SCOPES)[number];
export type { MiroIntegrationClient } from "./miro-client.js";
