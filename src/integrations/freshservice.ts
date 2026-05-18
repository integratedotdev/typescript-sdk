import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Freshservice");

const FRESHSERVICE_SCOPES = [
  "freshservice.tickets.read",
  "freshservice.tickets.write",
  "freshservice.assets.read",
  "freshservice.solutions.read",
] as const;

const FRESHSERVICE_TOOLS = [
  "freshservice_list_tickets",
  "freshservice_list_requesters",
  "freshservice_list_agents",
  "freshservice_list_assets",
  "freshservice_list_changes",
  "freshservice_list_problems",
  "freshservice_list_releases",
  "freshservice_create_ticket",
  "freshservice_list_solutions",
] as const;

export interface FreshserviceIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  domain?: string;
}

export function freshserviceIntegration(config: FreshserviceIntegrationConfig = {}): MCPIntegration<"freshservice"> {
  const oauth: OAuthConfig = { provider: "freshservice", clientId: config.clientId ?? getEnv("FRESHSERVICE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FRESHSERVICE_CLIENT_SECRET"), scopes: config.scopes ?? [...FRESHSERVICE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "freshservice", name: "Freshservice", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/freshservice.png", description: "Manage Freshservice tickets, requesters, agents, assets, changes, problems, releases, and solutions", category: "Business", tools: [...FRESHSERVICE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
    const domain = config.domain ?? getEnv("FRESHSERVICE_DOMAIN");
    const headers: Record<string, string> = {};
    if (domain) headers["X-Freshservice-Domain"] = domain;
    return headers;
    },
    async onInit() { logger.debug("Freshservice integration initialized"); },
    async onAfterConnect() { logger.debug("Freshservice integration connected"); },
  };
}

export type FreshserviceTools = (typeof FRESHSERVICE_TOOLS)[number];
export type FreshserviceScopes = (typeof FRESHSERVICE_SCOPES)[number];
export type { FreshserviceIntegrationClient } from "./freshservice-client.js";
