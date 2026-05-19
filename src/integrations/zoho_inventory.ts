import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Inventory");

const ZOHO_INVENTORY_SCOPES = [
  "ZohoInventory.fullaccess.all",
] as const;

const ZOHO_INVENTORY_TOOLS = [
  "zoho_inventory_list_organizations",
  "zoho_inventory_list_contacts",
  "zoho_inventory_list_items",
  "zoho_inventory_list_sales_orders",
  "zoho_inventory_create_sales_order",
  "zoho_inventory_list_packages",
] as const;

export interface ZohoInventoryIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoInventoryIntegration(config: ZohoInventoryIntegrationConfig = {}): MCPIntegration<"zoho_inventory"> {
  const oauth: OAuthConfig = { provider: "zoho_inventory", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_INVENTORY_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_inventory", name: "Zoho Inventory", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_inventory.png", description: "Manage Zoho Inventory organizations, contacts, items, sales orders, packages, and shipments", category: "Commerce", tools: [...ZOHO_INVENTORY_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Inventory integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Inventory integration connected"); },
  };
}

export type ZohoInventoryTools = (typeof ZOHO_INVENTORY_TOOLS)[number];
export type ZohoInventoryScopes = (typeof ZOHO_INVENTORY_SCOPES)[number];
export type { ZohoInventoryIntegrationClient } from "./zoho_inventory-client.js";
