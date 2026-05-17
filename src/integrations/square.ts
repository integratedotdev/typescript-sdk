import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Square");

const SQUARE_SCOPES = [
  "MERCHANT_PROFILE_READ",
  "PAYMENTS_READ",
  "PAYMENTS_WRITE",
  "CUSTOMERS_READ",
  "CUSTOMERS_WRITE",
  "ORDERS_READ",
  "ORDERS_WRITE",
  "ITEMS_READ",
  "ITEMS_WRITE",
  "INVOICES_READ",
  "INVOICES_WRITE",
] as const;

const SQUARE_TOOLS = [
  "square_get_merchant",
  "square_list_locations",
  "square_list_customers",
  "square_get_customer",
  "square_create_customer",
  "square_update_customer",
  "square_delete_customer",
  "square_search_catalog",
  "square_retrieve_catalog_object",
  "square_upsert_catalog_object",
  "square_search_orders",
  "square_create_order",
  "square_pay_order",
  "square_list_payments",
  "square_get_payment",
  "square_create_payment",
  "square_list_refunds",
  "square_refund_payment",
  "square_list_invoices",
  "square_get_invoice",
  "square_create_invoice",
] as const;

export interface SquareIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  environment?: "sandbox" | "production";
}

export function squareIntegration(config: SquareIntegrationConfig = {}): MCPIntegration<"square"> {
  const environment = config.environment ?? (getEnv("SQUARE_ENVIRONMENT") as "sandbox" | "production" | undefined);
  const oauth: OAuthConfig = {
    provider: "square",
    clientId: config.clientId ?? getEnv("SQUARE_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SQUARE_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SQUARE_SCOPES],
    redirectUri: config.redirectUri,
    config: { ...config, subdomain: environment === "sandbox" ? "sandbox" : undefined },
  };
  return {
    id: "square",
    name: "Square",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/square.png",
    description: "Manage Square merchants, locations, customers, catalog, orders, payments, refunds, and invoices",
    category: "Finance",
    tools: [...SQUARE_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Square integration initialized"); },
    async onAfterConnect() { logger.debug("Square integration connected"); },
  };
}

export type SquareTools = (typeof SQUARE_TOOLS)[number];
export type SquareScopes = (typeof SQUARE_SCOPES)[number];
export type { SquareIntegrationClient } from "./square-client.js";

