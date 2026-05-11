import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const PLANETSCALE_TOOLS = [
  "planetscale_get_current_user",
  "planetscale_list_organizations",
  "planetscale_get_organization",
  "planetscale_list_databases",
  "planetscale_get_database",
  "planetscale_list_branches",
  "planetscale_get_branch",
  "planetscale_list_deploy_requests",
  "planetscale_get_deploy_request",
] as const;

export interface PlanetScaleIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
  apiBaseUrl?: string;
}

export function planetscaleIntegration(config: PlanetScaleIntegrationConfig = {}): MCPIntegration<"planetscale"> {
  const oauth: OAuthConfig = {
    provider: "planetscale",
    clientId: config.clientId ?? getEnv("PLANETSCALE_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("PLANETSCALE_CLIENT_SECRET"),
    scopes: config.scopes ?? ["database:read_branches", "database:read_deploy_requests", "organization:read"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://auth.planetscale.com/oauth/authorize",
      token_endpoint: "https://auth.planetscale.com/oauth/token",
      apiBaseUrl: config.apiBaseUrl ?? "https://api.planetscale.com/v1",
    },
  };

  return {
    id: "planetscale",
    name: "PlanetScale",
    category: "Infrastructure",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/planetscale.png",
    tools: [...PLANETSCALE_TOOLS],
    oauth,
  };
}

export type PlanetScaleTools = (typeof PLANETSCALE_TOOLS)[number];
export type { PlanetScaleIntegrationClient } from "./planetscale-client.js";
