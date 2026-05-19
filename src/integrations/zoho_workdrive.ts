import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho WorkDrive");

const ZOHO_WORKDRIVE_SCOPES = [
  "WorkDrive.files.ALL",
  "WorkDrive.teamfolders.READ",
  "WorkDrive.users.READ",
] as const;

const ZOHO_WORKDRIVE_TOOLS = [
  "zoho_workdrive_list_teams",
  "zoho_workdrive_list_team_folders",
  "zoho_workdrive_get_team_folder",
  "zoho_workdrive_list_files",
  "zoho_workdrive_get_file",
  "zoho_workdrive_create_folder",
] as const;

export interface ZohoWorkdriveIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoWorkdriveIntegration(config: ZohoWorkdriveIntegrationConfig = {}): MCPIntegration<"zoho_workdrive"> {
  const oauth: OAuthConfig = { provider: "zoho_workdrive", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_WORKDRIVE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_workdrive", name: "Zoho WorkDrive", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_workdrive.png", description: "Manage Zoho WorkDrive team folders, files, folders, and collaborators", category: "Storage", tools: [...ZOHO_WORKDRIVE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho WorkDrive integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho WorkDrive integration connected"); },
  };
}

export type ZohoWorkdriveTools = (typeof ZOHO_WORKDRIVE_TOOLS)[number];
export type ZohoWorkdriveScopes = (typeof ZOHO_WORKDRIVE_SCOPES)[number];
export type { ZohoWorkdriveIntegrationClient } from "./zoho_workdrive-client.js";
