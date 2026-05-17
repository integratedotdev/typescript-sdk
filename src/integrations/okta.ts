import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Okta");

const OKTA_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "okta.users.read",
  "okta.users.manage",
  "okta.groups.read",
  "okta.groups.manage",
  "okta.apps.read",
  "okta.logs.read",
] as const;

const OKTA_TOOLS = [
  "okta_list_users",
  "okta_get_user",
  "okta_create_user",
  "okta_update_user",
  "okta_deactivate_user",
  "okta_list_groups",
  "okta_get_group",
  "okta_create_group",
  "okta_add_user_to_group",
  "okta_remove_user_from_group",
  "okta_list_apps",
  "okta_get_app",
  "okta_list_authorization_servers",
  "okta_list_policies",
  "okta_list_system_logs",
] as const;

export interface OktaIntegrationConfig {
  domain?: string;
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

function normalizeDomain(raw = ""): string {
  let domain = raw.trim().replace(/^https?:\/\//i, "");
  const slash = domain.indexOf("/");
  if (slash >= 0) domain = domain.slice(0, slash);
  return domain.replace(/\/$/, "");
}

export function oktaIntegration(config: OktaIntegrationConfig = {}): MCPIntegration<"okta"> {
  const domain = normalizeDomain(config.domain ?? getEnv("OKTA_DOMAIN") ?? "");
  const accessToken = config.accessToken ?? getEnv("OKTA_ACCESS_TOKEN");
  const oauth: OAuthConfig = {
    provider: "okta",
    clientId: config.clientId ?? getEnv("OKTA_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("OKTA_CLIENT_SECRET"),
    scopes: config.scopes ?? [...OKTA_SCOPES],
    redirectUri: config.redirectUri,
    config: { ...config, subdomain: domain || undefined },
  };
  return {
    id: "okta",
    name: "Okta",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/okta.png",
    description: "Manage Okta users, groups, apps, authorization servers, policies, and system logs",
    category: "Engineering",
    tools: [...OKTA_TOOLS],
    authType: accessToken ? "apiKey" : "oauth",
    oauth,
    getHeaders: () => ({
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(domain ? { "X-Okta-Domain": domain } : {}),
    }),
    async onInit() { logger.debug("Okta integration initialized"); },
    async onAfterConnect() { logger.debug("Okta integration connected"); },
  };
}

export type OktaTools = (typeof OKTA_TOOLS)[number];
export type OktaScopes = (typeof OKTA_SCOPES)[number];
export type { OktaIntegrationClient } from "./okta-client.js";

