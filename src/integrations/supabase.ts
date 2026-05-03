/**
 * Supabase Integration
 * Management API: organizations, projects, Postgres config, API keys, secrets, branches.
 * OAuth (hosted apps) or personal access token (SUPABASE_ACCESS_TOKEN) for automation.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Supabase");

const SUPABASE_API_BASE = "https://api.supabase.com";

const SUPABASE_TOOLS = [
  "supabase_get_profile",
  "supabase_list_organizations",
  "supabase_get_organization",
  "supabase_list_organization_projects",
  "supabase_list_projects",
  "supabase_get_project",
  "supabase_create_project",
  "supabase_update_project",
  "supabase_delete_project",
  "supabase_list_project_api_keys",
  "supabase_create_project_api_key",
  "supabase_delete_project_api_key",
  "supabase_list_project_secrets",
  "supabase_list_project_branches",
  "supabase_get_project_health",
  "supabase_get_database_postgres_config",
  "supabase_list_available_regions",
] as const;

export interface SupabaseIntegrationConfig {
  /**
   * Personal access token for the Management API (same privileges as your Supabase account).
   * When set (or when SUPABASE_ACCESS_TOKEN is set), the integration uses apiKey auth instead of OAuth.
   */
  accessToken?: string;
  /** Supabase OAuth client ID (defaults to SUPABASE_CLIENT_ID env var) */
  clientId?: string;
  /** Supabase OAuth client secret (defaults to SUPABASE_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (defaults to empty; Supabase authorization uses full consent for Management API) */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function supabaseIntegration(config: SupabaseIntegrationConfig = {}): MCPIntegration<"supabase"> {
  const pat = config.accessToken ?? getEnv("SUPABASE_ACCESS_TOKEN");
  if (pat) {
    return {
      id: "supabase",
      name: "Supabase",
      logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/supabase.png",
      description:
        "Manage Supabase organizations, projects, Postgres settings, API keys, secrets, and branches via the Management API",
      category: "Infrastructure",
      tools: [...SUPABASE_TOOLS],
      authType: "apiKey",
      getHeaders() {
        return {
          Authorization: `Bearer ${pat}`,
        };
      },

      async onInit(_client) {
        logger.debug("Supabase integration initialized (personal access token)");
      },

      async onAfterConnect(_client) {
        logger.debug("Supabase integration connected");
      },
    };
  }

  const oauth: OAuthConfig = {
    provider: "supabase",
    clientId: config.clientId ?? getEnv("SUPABASE_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SUPABASE_CLIENT_SECRET"),
    scopes: config.scopes ?? [],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: SUPABASE_API_BASE,
      authorization_endpoint: `${SUPABASE_API_BASE}/v1/oauth/authorize`,
      token_endpoint: `${SUPABASE_API_BASE}/v1/oauth/token`,
      token_auth_method: "client_secret_basic",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_method: "S256",
    },
  };

  return {
    id: "supabase",
    name: "Supabase",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/supabase.png",
    description:
      "Manage Supabase organizations, projects, Postgres settings, API keys, secrets, and branches via the Management API",
    category: "Infrastructure",
    tools: [...SUPABASE_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Supabase integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Supabase integration connected");
    },
  };
}

export type SupabaseTools = (typeof SUPABASE_TOOLS)[number];

export type { SupabaseIntegrationClient } from "./supabase-client.js";
