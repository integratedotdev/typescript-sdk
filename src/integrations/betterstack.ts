/**
 * Better Stack Integration
 * Logs / Telemetry API (formerly Logtail) with API token authentication
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("BetterStack");

const BETTERSTACK_TOOLS = [
  "betterstack_list_sources",
  "betterstack_get_source",
  "betterstack_create_source",
  "betterstack_update_source",
  "betterstack_delete_source",
  "betterstack_list_source_groups",
  "betterstack_get_source_group",
  "betterstack_update_source_group",
  "betterstack_list_collectors",
  "betterstack_list_source_metrics",
  "betterstack_ingest_logs",
] as const;

export interface BetterStackIntegrationOptions {
  /** Telemetry or global API token (defaults to BETTERSTACK_API_KEY) */
  apiKey?: string;
}

export function betterstackIntegration(
  options: BetterStackIntegrationOptions = {}
): MCPIntegration<"betterstack"> {
  const apiKey = options.apiKey ?? getEnv("BETTERSTACK_API_KEY");
  if (!apiKey) {
    throw new Error("betterstackIntegration requires apiKey or BETTERSTACK_API_KEY environment variable");
  }

  return {
    id: "betterstack",
    name: "Better Stack",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/betterstack.png",
    description:
      "Ingest and manage log sources, collectors, and metrics with Better Stack Logs (Logtail) Telemetry API",
    category: "Infrastructure",
    tools: [...BETTERSTACK_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiKey}`,
      };
    },

    async onInit(_client) {
      logger.debug("Better Stack integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Better Stack integration connected");
    },
  };
}

export type BetterStackTools = (typeof BETTERSTACK_TOOLS)[number];

export type { BetterStackIntegrationClient } from "./betterstack-client.js";
