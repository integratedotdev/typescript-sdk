/**
 * Canva Integration
 * Canva Connect APIs — designs, folders, exports, and brand templates (OAuth 2.0 + PKCE)
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Canva");

export interface CanvaIntegrationConfig {
  /** Canva OAuth client ID (defaults to CANVA_CLIENT_ID env var) */
  clientId?: string;
  /** Canva OAuth client secret (defaults to CANVA_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** OAuth scopes (defaults match server provider config) */
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

const CANVA_TOOLS = [
  "canva_get_me",
  "canva_get_profile",
  "canva_list_designs",
  "canva_get_design",
  "canva_get_design_export_formats",
  "canva_create_design",
  "canva_get_folder",
  "canva_list_folder_items",
  "canva_create_folder",
  "canva_update_folder",
  "canva_delete_folder",
  "canva_list_brand_templates",
  "canva_get_brand_template",
  "canva_create_export_job",
  "canva_get_export_job",
] as const;

export function canvaIntegration(config: CanvaIntegrationConfig = {}): MCPIntegration<"canva"> {
  const oauth: OAuthConfig = {
    provider: "canva",
    clientId: config.clientId ?? getEnv("CANVA_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("CANVA_CLIENT_SECRET"),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: { ...config },
  };

  return {
    id: "canva",
    name: "Canva",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/canva.png",
    tools: [...CANVA_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Canva integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Canva integration connected");
    },
  };
}

export type CanvaTools = (typeof CANVA_TOOLS)[number];

export type { CanvaIntegrationClient } from "./canva-client.js";
