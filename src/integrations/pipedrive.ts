import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Pipedrive");

const PIPEDRIVE_SCOPES = [
  "deals:read",
  "deals:full",
  "contacts:read",
  "contacts:full",
  "activities:read",
  "activities:full",
  "products:read",
  "products:full",
] as const;

const PIPEDRIVE_TOOLS = [
  "pipedrive_list_deals",
  "pipedrive_list_leads",
  "pipedrive_list_persons",
  "pipedrive_list_organizations",
  "pipedrive_list_activities",
  "pipedrive_list_notes",
  "pipedrive_list_pipelines",
  "pipedrive_list_products",
  "pipedrive_create_deal",
] as const;

export interface PipedriveIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function pipedriveIntegration(config: PipedriveIntegrationConfig = {}): MCPIntegration<"pipedrive"> {
  const oauth: OAuthConfig = { provider: "pipedrive", clientId: config.clientId ?? getEnv("PIPEDRIVE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("PIPEDRIVE_CLIENT_SECRET"), scopes: config.scopes ?? [...PIPEDRIVE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "pipedrive", name: "Pipedrive", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/pipedrive.png", description: "Manage Pipedrive deals, leads, people, organizations, activities, notes, pipelines, and products", category: "Business", tools: [...PIPEDRIVE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Pipedrive integration initialized"); },
    async onAfterConnect() { logger.debug("Pipedrive integration connected"); },
  };
}

export type PipedriveTools = (typeof PIPEDRIVE_TOOLS)[number];
export type PipedriveScopes = (typeof PIPEDRIVE_SCOPES)[number];
export type { PipedriveIntegrationClient } from "./pipedrive-client.js";
