import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Greenhouse");

const GREENHOUSE_SCOPES = [
  "candidates:read",
  "candidates:write",
  "jobs:read",
  "applications:read",
  "users:read",
] as const;

const GREENHOUSE_TOOLS = [
  "greenhouse_list_candidates",
  "greenhouse_get_candidate",
  "greenhouse_create_candidate",
  "greenhouse_list_jobs",
  "greenhouse_list_applications",
  "greenhouse_list_users",
] as const;

export interface GreenhouseIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function greenhouseIntegration(config: GreenhouseIntegrationConfig = {}): MCPIntegration<"greenhouse"> {
  const oauth: OAuthConfig = { provider: "greenhouse", clientId: config.clientId ?? getEnv("GREENHOUSE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GREENHOUSE_CLIENT_SECRET"), scopes: config.scopes ?? [...GREENHOUSE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "greenhouse", name: "Greenhouse", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/greenhouse.png", description: "Manage Greenhouse list candidates, get candidate, create candidate, list jobs, list applications", category: "HR & Recruiting", tools: [...GREENHOUSE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Greenhouse integration initialized"); },
    async onAfterConnect() { logger.debug("Greenhouse integration connected"); },
  };
}

export type GreenhouseTools = (typeof GREENHOUSE_TOOLS)[number];
export type GreenhouseScopes = (typeof GREENHOUSE_SCOPES)[number];
export type { GreenhouseIntegrationClient } from "./greenhouse-client.js";
