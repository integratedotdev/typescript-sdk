import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Writer");

const ZOHO_WRITER_SCOPES = [
  "ZohoWriter.documentEditor.ALL",
  "ZohoWriter.merge.ALL",
] as const;

const ZOHO_WRITER_TOOLS = [
  "zoho_writer_list_documents",
  "zoho_writer_get_document",
  "zoho_writer_create_document",
  "zoho_writer_list_templates",
  "zoho_writer_merge_document",
  "zoho_writer_export_document",
] as const;

export interface ZohoWriterIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoWriterIntegration(config: ZohoWriterIntegrationConfig = {}): MCPIntegration<"zoho_writer"> {
  const oauth: OAuthConfig = { provider: "zoho_writer", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_WRITER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_writer", name: "Zoho Writer", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_writer.png", description: "Manage Zoho Writer documents, templates, merges, and exports", category: "Productivity", tools: [...ZOHO_WRITER_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Writer integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Writer integration connected"); },
  };
}

export type ZohoWriterTools = (typeof ZOHO_WRITER_TOOLS)[number];
export type ZohoWriterScopes = (typeof ZOHO_WRITER_SCOPES)[number];
export type { ZohoWriterIntegrationClient } from "./zoho_writer-client.js";
