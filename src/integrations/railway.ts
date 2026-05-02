/**
 * Railway Integration
 * Enables Railway tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Railway");

const RAILWAY_SCOPES = [
  "openid",
  "profile",
  "email",
  "workspace:admin",
  "project:member",
] as const;

const RAILWAY_TOOLS = [
  "railway_get_current_user",
  "railway_get_workspace",
  "railway_list_regions",
  "railway_list_projects",
  "railway_get_project",
  "railway_create_project",
  "railway_update_project",
  "railway_delete_project",
  "railway_transfer_project",
  "railway_list_project_members",
  "railway_list_environments",
  "railway_get_environment",
  "railway_create_environment",
  "railway_rename_environment",
  "railway_delete_environment",
  "railway_get_environment_logs",
  "railway_get_environment_staged_changes",
  "railway_commit_environment_staged_changes",
  "railway_get_service",
  "railway_get_service_instance",
  "railway_create_service",
  "railway_update_service",
  "railway_update_service_instance",
  "railway_connect_service",
  "railway_disconnect_service",
  "railway_deploy_service",
  "railway_redeploy_service",
  "railway_get_service_limits",
  "railway_delete_service",
  "railway_list_deployments",
  "railway_get_deployment",
  "railway_get_latest_active_deployment",
  "railway_get_deployment_build_logs",
  "railway_get_deployment_runtime_logs",
  "railway_get_deployment_http_logs",
  "railway_redeploy_deployment",
  "railway_restart_deployment",
  "railway_rollback_deployment",
  "railway_stop_deployment",
  "railway_cancel_deployment",
  "railway_remove_deployment",
  "railway_get_variables",
  "railway_get_unrendered_variables",
  "railway_upsert_variable",
  "railway_upsert_variables",
  "railway_delete_variable",
  "railway_get_rendered_variables",
  "railway_list_domains",
  "railway_create_service_domain",
  "railway_delete_service_domain",
  "railway_check_custom_domain_availability",
  "railway_create_custom_domain",
  "railway_get_custom_domain_status",
  "railway_update_custom_domain",
  "railway_delete_custom_domain",
  "railway_list_project_volumes",
  "railway_get_volume_instance",
  "railway_create_volume",
  "railway_update_volume",
  "railway_update_volume_instance",
  "railway_delete_volume",
  "railway_list_volume_backups",
  "railway_create_volume_backup",
  "railway_restore_volume_backup",
  "railway_lock_volume_backup",
  "railway_delete_volume_backup",
  "railway_list_volume_backup_schedules",
  "railway_list_tcp_proxies",
] as const;

export interface RailwayIntegrationConfig {
  /** Railway OAuth client ID (defaults to RAILWAY_CLIENT_ID env var) */
  clientId?: string;
  /** Railway OAuth client secret (defaults to RAILWAY_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

export function railwayIntegration(config: RailwayIntegrationConfig = {}): MCPIntegration<"railway"> {
  const oauth: OAuthConfig = {
    provider: "railway",
    clientId: config.clientId ?? getEnv("RAILWAY_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("RAILWAY_CLIENT_SECRET"),
    scopes: config.scopes ?? [...RAILWAY_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://backboard.railway.com/oauth/auth",
      token_endpoint: "https://backboard.railway.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_method: "S256",
      apiBaseUrl: "https://backboard.railway.com/graphql/v2",
      ...config,
    },
  };

  return {
    id: "railway",
    name: "Railway",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/railway.png",
    description: "Manage Railway workspaces, projects, services, deployments, variables, domains, and volumes",
    category: "Infrastructure",
    tools: [...RAILWAY_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Railway integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Railway integration connected");
    },
  };
}

export type RailwayTools = typeof RAILWAY_TOOLS[number];
export type RailwayScopes = typeof RAILWAY_SCOPES[number];

export type { RailwayIntegrationClient } from "./railway-client.js";
