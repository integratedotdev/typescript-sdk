import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Dropbox Sign");

const DROPBOX_SIGN_SCOPES = [
  "basic_account_info",
  "request_signature",
  "signature_request_access",
] as const;

const DROPBOX_SIGN_TOOLS = [
  "dropbox_sign_get_account",
  "dropbox_sign_list_signature_requests",
  "dropbox_sign_get_signature_request",
  "dropbox_sign_send_signature_request",
  "dropbox_sign_list_templates",
  "dropbox_sign_get_template",
] as const;

export interface DropboxSignIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function dropboxSignIntegration(config: DropboxSignIntegrationConfig = {}): MCPIntegration<"dropbox_sign"> {
  const oauth: OAuthConfig = { provider: "dropbox_sign", clientId: config.clientId ?? getEnv("DROPBOX_SIGN_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("DROPBOX_SIGN_CLIENT_SECRET"), scopes: config.scopes ?? [...DROPBOX_SIGN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "dropbox_sign", name: "Dropbox Sign", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/dropbox_sign.png", description: "Manage Dropbox Sign get account, list signature requests, get signature request, send signature request, list templates", category: "Legal", tools: [...DROPBOX_SIGN_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Dropbox Sign integration initialized"); },
    async onAfterConnect() { logger.debug("Dropbox Sign integration connected"); },
  };
}

export type DropboxSignTools = (typeof DROPBOX_SIGN_TOOLS)[number];
export type DropboxSignScopes = (typeof DROPBOX_SIGN_SCOPES)[number];
export type { DropboxSignIntegrationClient } from "./dropbox_sign-client.js";
