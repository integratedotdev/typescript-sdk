import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Typeform");

const TYPEFORM_SCOPES = [
  "offline",
  "accounts:read",
  "forms:read",
  "forms:write",
  "responses:read",
  "workspaces:read",
] as const;

const TYPEFORM_TOOLS = [
  "typeform_get_me",
  "typeform_list_workspaces",
  "typeform_get_workspace",
  "typeform_list_forms",
  "typeform_get_form",
  "typeform_create_form",
  "typeform_update_form",
  "typeform_delete_form",
  "typeform_list_responses",
] as const;

export interface TypeformIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function typeformIntegration(config: TypeformIntegrationConfig = {}): MCPIntegration<"typeform"> {
  const oauth: OAuthConfig = {
    provider: "typeform",
    clientId: config.clientId ?? getEnv("TYPEFORM_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("TYPEFORM_CLIENT_SECRET"),
    scopes: config.scopes ?? [...TYPEFORM_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://api.typeform.com/oauth/authorize",
      token_endpoint: "https://api.typeform.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "typeform",
    name: "Typeform",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/typeform.png",
    description: "Manage Typeform workspaces, forms, and responses",
    category: "Productivity",
    tools: [...TYPEFORM_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Typeform integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Typeform integration connected");
    },
  };
}

export type TypeformTools = (typeof TYPEFORM_TOOLS)[number];
export type TypeformScopes = (typeof TYPEFORM_SCOPES)[number];
export type { TypeformIntegrationClient } from "./typeform-client.js";
