import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Xero");

const XERO_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "accounting.settings",
  "accounting.transactions",
  "accounting.contacts",
  "accounting.attachments",
] as const;

const XERO_TOOLS = [
  "xero_list_connections",
  "xero_get_organisation",
  "xero_list_accounts",
  "xero_list_contacts",
  "xero_get_contact",
  "xero_create_contact",
  "xero_list_invoices",
  "xero_get_invoice",
  "xero_create_invoice",
  "xero_list_bank_transactions",
] as const;

export interface XeroIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function xeroIntegration(config: XeroIntegrationConfig = {}): MCPIntegration<"xero"> {
  const oauth: OAuthConfig = {
    provider: "xero",
    clientId: config.clientId ?? getEnv("XERO_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("XERO_CLIENT_SECRET"),
    scopes: config.scopes ?? [...XERO_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://login.xero.com/identity/connect/authorize",
      token_endpoint: "https://identity.xero.com/connect/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "xero",
    name: "Xero",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/xero.png",
    description: "Manage Xero organisations, accounts, contacts, invoices, and bank transactions",
    category: "Finance",
    tools: [...XERO_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Xero integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Xero integration connected");
    },
  };
}

export type XeroTools = (typeof XERO_TOOLS)[number];
export type XeroScopes = (typeof XERO_SCOPES)[number];
export type { XeroIntegrationClient } from "./xero-client.js";
