import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Squarespace");

const SQUARESPACE_SCOPES = [

] as const;

const SQUARESPACE_TOOLS = [
  "squarespace_list_orders",
  "squarespace_get_order",
  "squarespace_list_products",
  "squarespace_get_product",
  "squarespace_list_inventory",
  "squarespace_adjust_inventory",
] as const;

export interface SquarespaceIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function squarespaceIntegration(config: SquarespaceIntegrationConfig = {}): MCPIntegration<"squarespace"> {
  const oauth: OAuthConfig = { provider: "squarespace", clientId: config.clientId ?? getEnv("SQUARESPACE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("SQUARESPACE_CLIENT_SECRET"), scopes: config.scopes ?? [...SQUARESPACE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "squarespace", name: "Squarespace", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/squarespace.png", description: "Manage Squarespace commerce orders, products, inventory, and profiles", category: "Websites & CMS", tools: [...SQUARESPACE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Squarespace integration initialized"); },
    async onAfterConnect() { logger.debug("Squarespace integration connected"); },
  };
}

export type SquarespaceTools = (typeof SQUARESPACE_TOOLS)[number];
export type SquarespaceScopes = (typeof SQUARESPACE_SCOPES)[number];
export type { SquarespaceIntegrationClient } from "./squarespace-client.js";
