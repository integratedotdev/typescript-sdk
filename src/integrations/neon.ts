/**
 * Neon Postgres — Neon API (API key) for projects, branches, keys, and connection strings.
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Neon");

const NEON_TOOLS = [
  "neon_list_api_keys",
  "neon_create_api_key",
  "neon_revoke_api_key",
  "neon_list_organizations",
  "neon_list_projects",
  "neon_list_shared_projects",
  "neon_create_project",
  "neon_get_project",
  "neon_update_project",
  "neon_delete_project",
  "neon_recover_project",
  "neon_list_branches",
  "neon_create_branch",
  "neon_get_branch",
  "neon_delete_branch",
  "neon_list_operations",
  "neon_get_operation",
  "neon_get_connection_uri",
] as const;

export interface NeonIntegrationOptions {
  /** Neon API key (defaults to NEON_API_KEY) */
  apiKey?: string;
}

export function neonIntegration(options: NeonIntegrationOptions = {}): MCPIntegration<"neon"> {
  const apiKey = options.apiKey ?? getEnv("NEON_API_KEY");
  if (!apiKey) {
    throw new Error("neonIntegration requires apiKey or NEON_API_KEY environment variable");
  }

  return {
    id: "neon",
    name: "Neon",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/neon.png",
    description: "Manage Neon Postgres projects, branches, API keys, and connection strings",
    category: "Infrastructure",
    tools: [...NEON_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiKey}`,
      };
    },

    async onInit(_client) {
      logger.debug("Neon integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Neon integration connected");
    },
  };
}

export type NeonTools = (typeof NEON_TOOLS)[number];

export type { NeonIntegrationClient } from "./neon-client.js";
