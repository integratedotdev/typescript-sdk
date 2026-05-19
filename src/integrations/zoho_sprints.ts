import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Sprints");

const ZOHO_SPRINTS_SCOPES = [
  "ZohoSprints.projects.ALL",
  "ZohoSprints.sprints.ALL",
  "ZohoSprints.workitems.ALL",
  "ZohoSprints.epics.ALL",
] as const;

const ZOHO_SPRINTS_TOOLS = [
  "zoho_sprints_list_portals",
  "zoho_sprints_list_projects",
  "zoho_sprints_list_sprints",
  "zoho_sprints_list_work_items",
  "zoho_sprints_create_work_item",
  "zoho_sprints_list_epics",
] as const;

export interface ZohoSprintsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoSprintsIntegration(config: ZohoSprintsIntegrationConfig = {}): MCPIntegration<"zoho_sprints"> {
  const oauth: OAuthConfig = { provider: "zoho_sprints", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_SPRINTS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_sprints", name: "Zoho Sprints", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_sprints.png", description: "Manage Zoho Sprints portals, projects, sprints, epics, and work items", category: "Engineering", tools: [...ZOHO_SPRINTS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Sprints integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Sprints integration connected"); },
  };
}

export type ZohoSprintsTools = (typeof ZOHO_SPRINTS_TOOLS)[number];
export type ZohoSprintsScopes = (typeof ZOHO_SPRINTS_SCOPES)[number];
export type { ZohoSprintsIntegrationClient } from "./zoho_sprints-client.js";
