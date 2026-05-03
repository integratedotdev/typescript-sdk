/**
 * Wix Integration
 * Wix Headless / REST APIs using a site API key and site ID (see Wix API Keys Manager).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Wix");

const WIX_TOOLS = [
  "wix_query_products",
  "wix_get_product",
  "wix_create_product",
  "wix_update_product",
  "wix_search_orders",
  "wix_get_order",
] as const;

export interface WixIntegrationOptions {
  /** Wix site API key (defaults to WIX_API_KEY) */
  apiKey?: string;
  /** Wix site ID for site-level API calls (defaults to WIX_SITE_ID) */
  siteId?: string;
}

export function wixIntegration(options: WixIntegrationOptions = {}): MCPIntegration<"wix"> {
  const apiKey = options.apiKey ?? getEnv("WIX_API_KEY");
  const siteId = options.siteId ?? getEnv("WIX_SITE_ID");
  if (!apiKey) {
    throw new Error("wixIntegration requires apiKey or WIX_API_KEY environment variable");
  }
  if (!siteId) {
    throw new Error("wixIntegration requires siteId or WIX_SITE_ID environment variable");
  }

  return {
    id: "wix",
    name: "Wix",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/wix.png",
    description: "Manage Wix site stores, products, and e-commerce orders via REST",
    category: "Business",
    tools: [...WIX_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: apiKey,
        "wix-site-id": siteId,
      };
    },

    async onInit(_client) {
      logger.debug("Wix integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Wix integration connected");
    },
  };
}

export type WixTools = (typeof WIX_TOOLS)[number];

export type { WixIntegrationClient } from "./wix-client.js";
