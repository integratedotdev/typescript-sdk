/**
 * Postman Integration
 * Postman REST API (API key via X-API-Key on the server; SDK sends Bearer with the same key).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Postman");

const POSTMAN_TOOLS = [
  "postman_get_me",
  "postman_list_workspaces",
  "postman_get_workspace",
  "postman_list_collections",
  "postman_get_collection",
  "postman_delete_collection",
  "postman_list_environments",
  "postman_get_environment",
  "postman_create_collection",
] as const;

export interface PostmanIntegrationOptions {
  /** Postman API key (defaults to POSTMAN_API_KEY env var) */
  apiKey?: string;
}

export function postmanIntegration(options: PostmanIntegrationOptions = {}): MCPIntegration<"postman"> {
  const apiKey = options.apiKey ?? getEnv("POSTMAN_API_KEY");
  if (!apiKey) {
    throw new Error("postmanIntegration requires apiKey or POSTMAN_API_KEY environment variable");
  }

  return {
    id: "postman",
    name: "Postman",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/postman.png",
    description: "Manage Postman workspaces, collections, and environments via the Postman API",
    category: "Engineering",
    tools: [...POSTMAN_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${apiKey}`,
      };
    },

    async onInit(_client) {
      logger.debug("Postman integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Postman integration connected");
    },
  };
}

export type PostmanTools = (typeof POSTMAN_TOOLS)[number];

export type { PostmanIntegrationClient } from "./postman-client.js";
