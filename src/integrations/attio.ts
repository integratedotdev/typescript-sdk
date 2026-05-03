import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Attio");

const ATTIO_SCOPES = [
  "record_permission:read-write",
  "object_configuration:read",
  "user_management:read",
  "task:read",
] as const;

const ATTIO_TOOLS = [
  "attio_get_self",
  "attio_query_people",
  "attio_get_person",
  "attio_create_person",
  "attio_update_person",
  "attio_assert_person",
  "attio_query_companies",
  "attio_get_company",
  "attio_create_company",
  "attio_update_company",
  "attio_assert_company",
  "attio_list_tasks",
  "attio_get_task",
] as const;

export interface AttioIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function attioIntegration(config: AttioIntegrationConfig = {}): MCPIntegration<"attio"> {
  const oauth: OAuthConfig = {
    provider: "attio",
    clientId: config.clientId ?? getEnv("ATTIO_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("ATTIO_CLIENT_SECRET"),
    scopes: config.scopes ?? [...ATTIO_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://app.attio.com/authorize",
      token_endpoint: "https://app.attio.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "attio",
    name: "Attio",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/attio.png",
    description: "Manage Attio people, companies, records, and tasks",
    category: "Business",
    tools: [...ATTIO_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Attio integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Attio integration connected");
    },
  };
}

export type AttioTools = (typeof ATTIO_TOOLS)[number];
export type AttioScopes = (typeof ATTIO_SCOPES)[number];
export type { AttioIntegrationClient } from "./attio-client.js";
