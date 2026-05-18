import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Uber");

const UBER_SCOPES = [
  "profile",
  "request",
  "history",
  "places",
] as const;

const UBER_TOOLS = [
  "uber_get_profile",
  "uber_list_products",
  "uber_estimate_price",
  "uber_estimate_time",
  "uber_list_requests",
  "uber_create_request",
] as const;

export interface UberIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function uberIntegration(config: UberIntegrationConfig = {}): MCPIntegration<"uber"> {
  const oauth: OAuthConfig = { provider: "uber", clientId: config.clientId ?? getEnv("UBER_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("UBER_CLIENT_SECRET"), scopes: config.scopes ?? [...UBER_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "uber", name: "Uber", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/uber.png", description: "Manage Uber get profile, list products, estimate price, estimate time, list requests", category: "Travel", tools: [...UBER_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Uber integration initialized"); },
    async onAfterConnect() { logger.debug("Uber integration connected"); },
  };
}

export type UberTools = (typeof UBER_TOOLS)[number];
export type UberScopes = (typeof UBER_SCOPES)[number];
export type { UberIntegrationClient } from "./uber-client.js";
