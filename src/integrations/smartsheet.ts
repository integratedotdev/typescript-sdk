import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Smartsheet");

const SMARTSHEET_SCOPES = [
  "READ_SHEETS",
  "WRITE_SHEETS",
  "ADMIN_SHEETS",
  "READ_USERS",
  "READ_WORKSPACES",
  "ADMIN_WORKSPACES",
] as const;

const SMARTSHEET_TOOLS = [
  "smartsheet_list_sheets",
  "smartsheet_get_sheet",
  "smartsheet_create_sheet",
  "smartsheet_add_rows",
  "smartsheet_update_rows",
  "smartsheet_list_workspaces",
  "smartsheet_list_reports",
  "smartsheet_list_attachments",
] as const;

export interface SmartsheetIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;

}

export function smartsheetIntegration(config: SmartsheetIntegrationConfig = {}): MCPIntegration<"smartsheet"> {
  const oauth: OAuthConfig = { provider: "smartsheet", clientId: config.clientId ?? getEnv("SMARTSHEET_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("SMARTSHEET_CLIENT_SECRET"), scopes: config.scopes ?? [...SMARTSHEET_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "smartsheet", name: "Smartsheet", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/smartsheet.png", description: "Manage Smartsheet sheets, rows, columns, workspaces, reports, and attachments", category: "Productivity", tools: [...SMARTSHEET_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Smartsheet integration initialized"); },
    async onAfterConnect() { logger.debug("Smartsheet integration connected"); },
  };
}

export type SmartsheetTools = (typeof SMARTSHEET_TOOLS)[number];
export type SmartsheetScopes = (typeof SMARTSHEET_SCOPES)[number];
export type { SmartsheetIntegrationClient } from "./smartsheet-client.js";
