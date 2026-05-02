/**
 * Netlify Integration
 * Enables Netlify deployment and hosting tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Netlify");

const NETLIFY_TOOLS = [
  "netlify_get_current_user",
  "netlify_list_accounts",
  "netlify_get_account",
  "netlify_list_sites",
  "netlify_get_site",
  "netlify_create_site",
  "netlify_update_site",
  "netlify_delete_site",
  "netlify_enable_site",
  "netlify_disable_site",
  "netlify_list_deploys",
  "netlify_get_deploy",
  "netlify_create_deploy",
  "netlify_cancel_deploy",
  "netlify_restore_deploy",
  "netlify_lock_deploy",
  "netlify_unlock_deploy",
  "netlify_list_builds",
  "netlify_get_build",
  "netlify_trigger_build",
  "netlify_list_env_vars",
  "netlify_get_env_var",
  "netlify_create_env_vars",
  "netlify_update_env_var",
  "netlify_delete_env_var",
  "netlify_list_build_hooks",
  "netlify_create_build_hook",
  "netlify_delete_build_hook",
  "netlify_list_forms",
  "netlify_list_form_submissions",
  "netlify_list_dns_zones",
  "netlify_get_dns_records",
  "netlify_create_dns_record",
  "netlify_delete_dns_record",
  "netlify_list_functions",
  "netlify_list_files",
  "netlify_purge_cache",
] as const;

export interface NetlifyIntegrationConfig {
  /** Netlify OAuth client ID (defaults to NETLIFY_CLIENT_ID env var) */
  clientId?: string;
  /** Netlify OAuth client secret (defaults to NETLIFY_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
}

export function netlifyIntegration(config: NetlifyIntegrationConfig = {}): MCPIntegration<"netlify"> {
  const oauth: OAuthConfig = {
    provider: "netlify",
    clientId: config.clientId ?? getEnv("NETLIFY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("NETLIFY_CLIENT_SECRET"),
    scopes: [],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://app.netlify.com/authorize",
      token_endpoint: "https://api.netlify.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "netlify",
    name: "Netlify",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/netlify.png",
    description: "Manage Netlify sites, deploys, builds, and environment variables",
    category: "Infrastructure",
    tools: [...NETLIFY_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Netlify integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Netlify integration connected");
    },
  };
}

export type NetlifyTools = (typeof NETLIFY_TOOLS)[number];

export type { NetlifyIntegrationClient } from "./netlify-client.js";
