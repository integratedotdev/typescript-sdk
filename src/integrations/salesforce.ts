/**
 * Salesforce Integration
 * OAuth + REST API tools for Salesforce CRM
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Salesforce");

export interface SalesforceIntegrationConfig {
  /** Salesforce Connected App consumer key (defaults to SALESFORCE_CLIENT_ID) */
  clientId?: string;
  /** Connected App consumer secret (defaults to SALESFORCE_CLIENT_SECRET) */
  clientSecret?: string;
  /** OAuth scopes (default: api refresh_token offline_access) */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
  /**
   * OAuth host: pass `test` or `sandbox` to use https://test.salesforce.com for authorize/token.
   * Production uses login.salesforce.com.
   */
  subdomain?: string;
}

const SALESFORCE_TOOLS = [
  "salesforce_query",
  "salesforce_get_limits",
  "salesforce_describe_global",
  "salesforce_sobject_describe",
  "salesforce_sobject_get",
  "salesforce_sobject_create",
  "salesforce_sobject_update",
  "salesforce_sobject_delete",
] as const;

export function salesforceIntegration(
  config: SalesforceIntegrationConfig = {},
): MCPIntegration<"salesforce"> {
  const oauth: OAuthConfig = {
    provider: "salesforce",
    clientId: config.clientId ?? getEnv("SALESFORCE_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SALESFORCE_CLIENT_SECRET"),
    scopes: config.scopes ?? ["api", "refresh_token", "offline_access"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      ...config,
      subdomain: config.subdomain ?? getEnv("SALESFORCE_SUBDOMAIN"),
    },
  };

  return {
    id: "salesforce",
    name: "Salesforce",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/salesforce.png",
    tools: [...SALESFORCE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Salesforce integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Salesforce integration connected");
    },
  };
}

export type SalesforceTools = (typeof SALESFORCE_TOOLS)[number];

export type { SalesforceIntegrationClient } from "./salesforce-client.js";
