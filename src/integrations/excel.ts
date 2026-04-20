/**
 * Excel Integration
 * Enables Excel workbook tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Excel');

export interface ExcelIntegrationConfig {
  /** Microsoft OAuth client ID (defaults to EXCEL_CLIENT_ID env var) */
  clientId?: string;
  /** Microsoft OAuth client secret (defaults to EXCEL_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const EXCEL_TOOLS = [
  "excel_list",
  "excel_get",
  "excel_create",
  "excel_delete",
  "excel_share",
  "excel_list_worksheets",
  "excel_add_worksheet",
  "excel_delete_worksheet",
  "excel_get_range",
  "excel_update_range",
  "excel_clear_range",
  "excel_get_used_range",
  "excel_list_tables",
  "excel_create_table",
  "excel_get_table_rows",
  "excel_add_table_rows",
] as const;

export function excelIntegration(config: ExcelIntegrationConfig = {}): MCPIntegration<"excel"> {
  const oauth: OAuthConfig = {
    provider: "excel",
    clientId: config.clientId ?? getEnv('EXCEL_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('EXCEL_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "excel",
    name: "Excel",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/excel.png",
    tools: [...EXCEL_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Excel integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Excel integration connected");
    },
  };
}

export type ExcelTools = typeof EXCEL_TOOLS[number];
export type { ExcelIntegrationClient } from "./excel-client.js";
