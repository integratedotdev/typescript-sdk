import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("UPS");

const UPS_SCOPES = [
  "shipments",
  "tracking",
  "rating",
  "address_validation",
] as const;

const UPS_TOOLS = [
  "ups_track_shipment",
  "ups_rate_shipment",
  "ups_create_shipment",
  "ups_void_shipment",
  "ups_validate_address",
] as const;

export interface UpsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function upsIntegration(config: UpsIntegrationConfig = {}): MCPIntegration<"ups"> {
  const oauth: OAuthConfig = { provider: "ups", clientId: config.clientId ?? getEnv("UPS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("UPS_CLIENT_SECRET"), scopes: config.scopes ?? [...UPS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "ups", name: "UPS", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/ups.png", description: "Manage UPS track shipment, rate shipment, create shipment, void shipment, validate address", category: "Shipping & Logistics", tools: [...UPS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("UPS integration initialized"); },
    async onAfterConnect() { logger.debug("UPS integration connected"); },
  };
}

export type UpsTools = (typeof UPS_TOOLS)[number];
export type UpsScopes = (typeof UPS_SCOPES)[number];
export type { UpsIntegrationClient } from "./ups-client.js";
