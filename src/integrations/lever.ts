import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Lever");

const LEVER_SCOPES = [
  "opportunities:read",
  "opportunities:write",
  "postings:read",
  "postings:write",
  "users:read",
  "offline_access",
] as const;

const LEVER_TOOLS = [
  "lever_list_opportunities",
  "lever_get_opportunity",
  "lever_create_opportunity",
  "lever_list_postings",
  "lever_list_users",
  "lever_list_stages",
] as const;

export interface LeverIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function leverIntegration(config: LeverIntegrationConfig = {}): MCPIntegration<"lever"> {
  const oauth: OAuthConfig = { provider: "lever", clientId: config.clientId ?? getEnv("LEVER_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("LEVER_CLIENT_SECRET"), scopes: config.scopes ?? [...LEVER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "lever", name: "Lever", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/lever.png", description: "Manage Lever list opportunities, get opportunity, create opportunity, list postings, list users", category: "HR & Recruiting", tools: [...LEVER_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Lever integration initialized"); },
    async onAfterConnect() { logger.debug("Lever integration connected"); },
  };
}

export type LeverTools = (typeof LEVER_TOOLS)[number];
export type LeverScopes = (typeof LEVER_SCOPES)[number];
export type { LeverIntegrationClient } from "./lever-client.js";
