import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Uber Eats");

const UBER_EATS_SCOPES = [
  "eats.store",
  "eats.order",
  "eats.report",
] as const;

const UBER_EATS_TOOLS = [
  "uber_eats_list_stores",
  "uber_eats_get_store",
  "uber_eats_list_orders",
  "uber_eats_get_order",
  "uber_eats_update_order_status",
  "uber_eats_get_menu",
] as const;

export interface UberEatsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function uberEatsIntegration(config: UberEatsIntegrationConfig = {}): MCPIntegration<"uber_eats"> {
  const oauth: OAuthConfig = { provider: "uber_eats", clientId: config.clientId ?? getEnv("UBER_EATS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("UBER_EATS_CLIENT_SECRET"), scopes: config.scopes ?? [...UBER_EATS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "uber_eats", name: "Uber Eats", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/uber_eats.png", description: "Manage Uber Eats list stores, get store, list orders, get order, update order status", category: "Food", tools: [...UBER_EATS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Uber Eats integration initialized"); },
    async onAfterConnect() { logger.debug("Uber Eats integration connected"); },
  };
}

export type UberEatsTools = (typeof UBER_EATS_TOOLS)[number];
export type UberEatsScopes = (typeof UBER_EATS_SCOPES)[number];
export type { UberEatsIntegrationClient } from "./uber_eats-client.js";
