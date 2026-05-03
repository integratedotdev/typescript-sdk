/**
 * Dropbox Paper Integration
 * Create, update, and export Paper documents via the Dropbox API (same OAuth host as Dropbox).
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Paper");

const PAPER_SCOPES = [
  "account_info.read",
  "files.metadata.read",
  "files.content.read",
  "files.content.write",
] as const;

const PAPER_TOOLS = [
  "paper_create_doc",
  "paper_update_doc",
  "paper_export_doc",
] as const;

export interface PaperIntegrationConfig {
  /** OAuth client ID (defaults to PAPER_CLIENT_ID, then DROPBOX_CLIENT_ID) */
  clientId?: string;
  /** OAuth client secret (defaults to PAPER_CLIENT_SECRET, then DROPBOX_CLIENT_SECRET) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

function resolveClientId(config: PaperIntegrationConfig): string | undefined {
  return config.clientId ?? getEnv("PAPER_CLIENT_ID") ?? getEnv("DROPBOX_CLIENT_ID");
}

function resolveClientSecret(config: PaperIntegrationConfig): string | undefined {
  return config.clientSecret ?? getEnv("PAPER_CLIENT_SECRET") ?? getEnv("DROPBOX_CLIENT_SECRET");
}

export function paperIntegration(config: PaperIntegrationConfig = {}): MCPIntegration<"paper"> {
  if (
    config.scopes !== undefined &&
    (!Array.isArray(config.scopes) || config.scopes.some((scope) => typeof scope !== "string"))
  ) {
    throw new Error("paperIntegration scopes must be an array of strings");
  }

  const oauth: OAuthConfig = {
    provider: "paper",
    clientId: resolveClientId(config),
    clientSecret: resolveClientSecret(config),
    scopes: config.scopes ?? [...PAPER_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://www.dropbox.com/oauth2/authorize",
      token_endpoint: "https://api.dropboxapi.com/oauth2/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "paper",
    name: "Dropbox Paper",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/paper.png",
    description: "Create, update, and export Dropbox Paper documents",
    category: "Productivity",
    tools: [...PAPER_TOOLS],
    authType: "oauth",
    oauth,

    async onInit(_client) {
      logger.debug("Paper integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Paper integration connected");
    },
  };
}

export type PaperTools = (typeof PAPER_TOOLS)[number];
export type PaperScopes = (typeof PAPER_SCOPES)[number];
export type { PaperIntegrationClient } from "./paper-client.js";
