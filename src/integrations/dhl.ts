import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("DHL");

const DHL_SCOPES = [
  "shipping",
  "tracking",
] as const;

const DHL_TOOLS = [
  "dhl_track_shipment",
  "dhl_create_shipment",
  "dhl_get_label",
  "dhl_delete_shipment",
  "dhl_validate_address",
] as const;

export interface DhlIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function dhlIntegration(config: DhlIntegrationConfig = {}): MCPIntegration<"dhl"> {
  const oauth: OAuthConfig = { provider: "dhl", clientId: config.clientId ?? getEnv("DHL_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("DHL_CLIENT_SECRET"), scopes: config.scopes ?? [...DHL_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "dhl", name: "DHL", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/dhl.png", description: "Manage DHL track shipment, create shipment, get label, delete shipment, validate address", category: "Shipping & Logistics", tools: [...DHL_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("DHL integration initialized"); },
    async onAfterConnect() { logger.debug("DHL integration connected"); },
  };
}

export type DhlTools = (typeof DHL_TOOLS)[number];
export type DhlScopes = (typeof DHL_SCOPES)[number];
export type { DhlIntegrationClient } from "./dhl-client.js";
