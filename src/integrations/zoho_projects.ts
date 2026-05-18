import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Projects");

const ZOHO_PROJECTS_SCOPES = [
  "ZohoProjects.portals.ALL",
  "ZohoProjects.projects.ALL",
  "ZohoProjects.tasks.ALL",
  "ZohoProjects.issues.ALL",
] as const;

const ZOHO_PROJECTS_TOOLS = [
  "zoho_projects_list_portals",
  "zoho_projects_list_projects",
  "zoho_projects_get_project",
  "zoho_projects_list_milestones",
  "zoho_projects_list_tasklists",
  "zoho_projects_list_tasks",
  "zoho_projects_create_task",
  "zoho_projects_list_issues",
  "zoho_projects_list_timesheets",
] as const;

export interface ZohoProjectsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoProjectsIntegration(config: ZohoProjectsIntegrationConfig = {}): MCPIntegration<"zoho_projects"> {
  const oauth: OAuthConfig = { provider: "zoho_projects", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_PROJECTS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_projects", name: "Zoho Projects", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_projects.png", description: "Manage Zoho Projects portals, projects, milestones, tasks, issues, and timesheets", category: "Productivity", tools: [...ZOHO_PROJECTS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const region = config.region ?? getEnv("ZOHO_REGION");
    const headers: Record<string, string> = {};
    if (region) headers["X-Zoho-Region"] = region;
    return headers;
    },
    async onInit() { logger.debug("Zoho Projects integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Projects integration connected"); },
  };
}

export type ZohoProjectsTools = (typeof ZOHO_PROJECTS_TOOLS)[number];
export type ZohoProjectsScopes = (typeof ZOHO_PROJECTS_SCOPES)[number];
export type { ZohoProjectsIntegrationClient } from "./zoho_projects-client.js";
