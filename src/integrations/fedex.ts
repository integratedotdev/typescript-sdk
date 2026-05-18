import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("FedEx");

const FEDEX_SCOPES = [
  "ship",
  "track",
  "rates",
  "address",
] as const;

const FEDEX_TOOLS = [
  "fedex_track_shipments",
  "fedex_rate_shipment",
  "fedex_create_shipment",
  "fedex_cancel_shipment",
  "fedex_validate_address",
] as const;

export interface FedexIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function fedexIntegration(config: FedexIntegrationConfig = {}): MCPIntegration<"fedex"> {
  const oauth: OAuthConfig = { provider: "fedex", clientId: config.clientId ?? getEnv("FEDEX_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FEDEX_CLIENT_SECRET"), scopes: config.scopes ?? [...FEDEX_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "fedex", name: "FedEx", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/fedex.png", description: "Manage FedEx track shipments, rate shipment, create shipment, cancel shipment, validate address", category: "Shipping & Logistics", tools: [...FEDEX_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("FedEx integration initialized"); },
    async onAfterConnect() { logger.debug("FedEx integration connected"); },
  };
}

export type FedexTools = (typeof FEDEX_TOOLS)[number];
export type FedexScopes = (typeof FEDEX_SCOPES)[number];
export type { FedexIntegrationClient } from "./fedex-client.js";
