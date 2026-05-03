/**
 * WorkOS Integration
 * Enterprise SSO, directory sync, and AuthKit user management via API key.
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("WorkOS");

const WORKOS_TOOLS = [
  "workos_list_organizations",
  "workos_get_organization",
  "workos_create_organization",
  "workos_update_organization",
  "workos_list_users",
  "workos_get_user",
  "workos_list_organization_memberships",
  "workos_list_directories",
  "workos_get_directory",
  "workos_list_directory_users",
  "workos_get_directory_user",
] as const;

export interface WorkOSIntegrationOptions {
  /** WorkOS API key (defaults to WORKOS_API_KEY env var) */
  apiKey?: string;
}

export function workosIntegration(options: WorkOSIntegrationOptions = {}): MCPIntegration<"workos"> {
  const apiKey = options.apiKey ?? getEnv("WORKOS_API_KEY");
  if (!apiKey) {
    throw new Error("workosIntegration requires apiKey or WORKOS_API_KEY environment variable");
  }

  return {
    id: "workos",
    name: "WorkOS",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/workos.png",
    description: "Manage WorkOS organizations, AuthKit users, memberships, and directory sync",
    category: "Infrastructure",
    tools: [...WORKOS_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiKey}`,
      };
    },

    async onInit(_client) {
      logger.debug("WorkOS integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("WorkOS integration connected");
    },
  };
}

export type WorkOSTools = (typeof WORKOS_TOOLS)[number];

export type { WorkOSIntegrationClient } from "./workos-client.js";
