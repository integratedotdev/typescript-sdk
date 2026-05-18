/**
 * Astronomer (Astro) Integration
 * Astro API v1 with organization, workspace, deployment, and cluster tools (Bearer API token).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Astronomer");

const ASTRONOMER_TOOLS = [
  "astronomer_get_self",
  "astronomer_list_organizations",
  "astronomer_get_organization",
  "astronomer_list_workspaces",
  "astronomer_get_workspace",
  "astronomer_list_clusters",
  "astronomer_get_cluster",
  "astronomer_list_deployments",
  "astronomer_get_deployment",
  "astronomer_create_deployment",
  "astronomer_update_deployment",
  "astronomer_list_deploys",
  "astronomer_get_deploy",
] as const;

export interface AstronomerIntegrationOptions {
  /** Astro organization, workspace, or deployment API token (defaults to ASTRO_API_TOKEN or ASTRONOMER_API_TOKEN) */
  apiToken?: string;
}

export function astronomerIntegration(options: AstronomerIntegrationOptions = {}): MCPIntegration<"astronomer"> {
  const apiToken =
    options.apiToken ?? getEnv("ASTRO_API_TOKEN") ?? getEnv("ASTRONOMER_API_TOKEN");
  if (!apiToken) {
    throw new Error(
      "astronomerIntegration requires apiToken or ASTRO_API_TOKEN / ASTRONOMER_API_TOKEN environment variable",
    );
  }

  return {
    id: "astronomer",
    name: "Astronomer",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/astronomer.png",
    description:
      "Manage Astro organizations, workspaces, deployments, clusters, and deploy history via the Astro API v1",
    category: "Engineering",
    tools: [...ASTRONOMER_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiToken}`,
      };
    },

    async onInit(_client) {
      logger.debug("Astronomer integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Astronomer integration connected");
    },
  };
}

export type AstronomerTools = (typeof ASTRONOMER_TOOLS)[number];

export type { AstronomerIntegrationClient } from "./astronomer-client.js";
