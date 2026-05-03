/**
 * Webflow Integration
 * Webflow Data API (v2) — sites, CMS, pages, forms, webhooks, publishing
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Webflow");

const WEBFLOW_TOOLS = [
  "webflow_token_introspect",
  "webflow_get_authorized_user",
  "webflow_list_sites",
  "webflow_get_site",
  "webflow_get_site_custom_domains",
  "webflow_publish_site",
  "webflow_list_site_pages",
  "webflow_list_site_collections",
  "webflow_get_collection",
  "webflow_list_collection_items",
  "webflow_list_live_collection_items",
  "webflow_get_collection_item",
  "webflow_create_collection_items",
  "webflow_update_collection_items",
  "webflow_delete_collection_items",
  "webflow_publish_collection_items",
  "webflow_list_site_forms",
  "webflow_list_site_webhooks",
] as const;

const DEFAULT_WEBFLOW_SCOPES = [
  "authorized_user:read",
  "assets:read",
  "assets:write",
  "cms:read",
  "cms:write",
  "custom_code:read",
  "custom_code:write",
  "forms:read",
  "forms:write",
  "pages:read",
  "pages:write",
  "sites:read",
  "sites:write",
] as const;

export interface WebflowIntegrationConfig {
  /** Webflow OAuth client ID (defaults to WEBFLOW_CLIENT_ID env var) */
  clientId?: string;
  /** Webflow OAuth client secret (defaults to WEBFLOW_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (defaults to a broad Data API scope set) */
  scopes?: string[];
  /** OAuth redirect URI (optional — auto-detected from environment) */
  redirectUri?: string;
}

export function webflowIntegration(config: WebflowIntegrationConfig = {}): MCPIntegration<"webflow"> {
  const oauth: OAuthConfig = {
    provider: "webflow",
    clientId: config.clientId ?? getEnv("WEBFLOW_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("WEBFLOW_CLIENT_SECRET"),
    scopes: config.scopes ?? [...DEFAULT_WEBFLOW_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://webflow.com/oauth/authorize",
      token_endpoint: "https://api.webflow.com/oauth/access_token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "webflow",
    name: "Webflow",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/webflow.png",
    description: "Manage Webflow sites, CMS collections, pages, forms, and publishing",
    category: "Engineering",
    tools: [...WEBFLOW_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Webflow integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Webflow integration connected");
    },
  };
}

export type WebflowTools = (typeof WEBFLOW_TOOLS)[number];

export type { WebflowIntegrationClient } from "./webflow-client.js";
