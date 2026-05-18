import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("DocuSign");

const DOCUSIGN_SCOPES = [
  "signature",
  "impersonation",
] as const;

const DOCUSIGN_TOOLS = [
  "docusign_get_user_info",
  "docusign_list_envelopes",
  "docusign_get_envelope",
  "docusign_create_envelope",
  "docusign_list_recipients",
  "docusign_get_document",
  "docusign_list_templates",
] as const;

export interface DocusignIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  environment?: "production" | "demo";
  baseUri?: string;
}

export function docusignIntegration(config: DocusignIntegrationConfig = {}): MCPIntegration<"docusign"> {
  const oauth: OAuthConfig = { provider: "docusign", clientId: config.clientId ?? getEnv("DOCUSIGN_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("DOCUSIGN_CLIENT_SECRET"), scopes: config.scopes ?? [...DOCUSIGN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "docusign", name: "DocuSign", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/docusign.png", description: "Manage DocuSign eSignature accounts, envelopes, recipients, documents, and templates", category: "Business", tools: [...DOCUSIGN_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const headers: Record<string, string> = {};
    if (config.baseUri) headers["X-DocuSign-Base-Uri"] = config.baseUri;
    return headers;
    },
    async onInit() { logger.debug("DocuSign integration initialized"); },
    async onAfterConnect() { logger.debug("DocuSign integration connected"); },
  };
}

export type DocusignTools = (typeof DOCUSIGN_TOOLS)[number];
export type DocusignScopes = (typeof DOCUSIGN_SCOPES)[number];
export type { DocusignIntegrationClient } from "./docusign-client.js";
