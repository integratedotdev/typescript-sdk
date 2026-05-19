import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("OneNote");

const ONENOTE_SCOPES = [
  "offline_access",
  "User.Read",
  "Notes.ReadWrite.All",
] as const;

const ONENOTE_TOOLS = [
  "onenote_list_notebooks",
  "onenote_get_notebook",
  "onenote_list_sections",
  "onenote_create_section",
  "onenote_list_pages",
  "onenote_get_page",
] as const;

export interface OnenoteIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function onenoteIntegration(config: OnenoteIntegrationConfig = {}): MCPIntegration<"onenote"> {
  const oauth: OAuthConfig = { provider: "onenote", clientId: config.clientId ?? getEnv("ONENOTE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ONENOTE_CLIENT_SECRET"), scopes: config.scopes ?? [...ONENOTE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "onenote", name: "OneNote", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/onenote.png", description: "Manage OneNote notebooks, sections, pages, and section creation through Microsoft Graph", category: "Productivity", tools: [...ONENOTE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("OneNote integration initialized"); },
    async onAfterConnect() { logger.debug("OneNote integration connected"); },
  };
}

export type OnenoteTools = (typeof ONENOTE_TOOLS)[number];
export type OnenoteScopes = (typeof ONENOTE_SCOPES)[number];
export type { OnenoteIntegrationClient } from "./onenote-client.js";
