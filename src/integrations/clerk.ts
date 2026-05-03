/**
 * Clerk Integration
 * Clerk Backend API (users, organizations, sessions) with secret-key authentication
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Clerk");

const CLERK_TOOLS = [
  "clerk_list_users",
  "clerk_get_user",
  "clerk_create_user",
  "clerk_update_user",
  "clerk_delete_user",
  "clerk_list_organizations",
  "clerk_get_organization",
  "clerk_create_organization",
  "clerk_update_organization",
  "clerk_delete_organization",
  "clerk_list_sessions",
  "clerk_get_session",
  "clerk_revoke_session",
] as const;

export interface ClerkIntegrationOptions {
  /** Clerk secret key (defaults to CLERK_SECRET_KEY env var) */
  secretKey?: string;
}

export function clerkIntegration(options: ClerkIntegrationOptions = {}): MCPIntegration<"clerk"> {
  const secretKey = options.secretKey ?? getEnv("CLERK_SECRET_KEY");
  if (!secretKey) {
    throw new Error("clerkIntegration requires secretKey or CLERK_SECRET_KEY environment variable");
  }

  return {
    id: "clerk",
    name: "Clerk",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/clerk.png",
    description: "Manage Clerk users, organizations, and sessions via the Backend API",
    category: "Business",
    tools: [...CLERK_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${secretKey}`,
      };
    },

    async onInit(_client) {
      logger.debug("Clerk integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Clerk integration connected");
    },
  };
}

export type ClerkTools = (typeof CLERK_TOOLS)[number];

export type { ClerkIntegrationClient } from "./clerk-client.js";
