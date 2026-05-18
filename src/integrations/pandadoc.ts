import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("PandaDoc");

const PANDADOC_SCOPES = [
  "read+write",
] as const;

const PANDADOC_TOOLS = [
  "pandadoc_list_documents",
  "pandadoc_get_document",
  "pandadoc_create_document",
  "pandadoc_send_document",
  "pandadoc_list_templates",
  "pandadoc_create_session",
] as const;

export interface PandadocIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function pandadocIntegration(config: PandadocIntegrationConfig = {}): MCPIntegration<"pandadoc"> {
  const oauth: OAuthConfig = { provider: "pandadoc", clientId: config.clientId ?? getEnv("PANDADOC_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("PANDADOC_CLIENT_SECRET"), scopes: config.scopes ?? [...PANDADOC_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "pandadoc", name: "PandaDoc", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/pandadoc.png", description: "Manage PandaDoc list documents, get document, create document, send document, list templates", category: "Legal", tools: [...PANDADOC_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("PandaDoc integration initialized"); },
    async onAfterConnect() { logger.debug("PandaDoc integration connected"); },
  };
}

export type PandadocTools = (typeof PANDADOC_TOOLS)[number];
export type PandadocScopes = (typeof PANDADOC_SCOPES)[number];
export type { PandadocIntegrationClient } from "./pandadoc-client.js";
