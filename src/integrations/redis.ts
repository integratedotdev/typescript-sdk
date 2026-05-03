/**
 * Redis Cloud Integration
 * Managed Redis Cloud control-plane API (subscriptions, databases, tasks, logs) — not the Redis wire protocol.
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Redis Cloud");

const REDIS_TOOLS = [
  "redis_list_subscriptions",
  "redis_get_subscription",
  "redis_list_fixed_subscriptions",
  "redis_get_fixed_subscription",
  "redis_list_databases",
  "redis_get_database",
  "redis_create_database",
  "redis_update_database",
  "redis_delete_database",
  "redis_list_essentials_databases",
  "redis_get_essentials_database",
  "redis_create_essentials_database",
  "redis_update_essentials_database",
  "redis_delete_essentials_database",
  "redis_get_task",
  "redis_list_logs",
] as const;

/** Encodes account + user secret keys for the MCP Authorization header (parsed by the Integrate MCP server). */
export function encodeRedisCloudBearerToken(accountKey: string, secretKey: string): string {
  const json = JSON.stringify({ account_key: accountKey, secret_key: secretKey });
  let b64: string;
  if (typeof Buffer !== "undefined") {
    b64 = Buffer.from(json, "utf8").toString("base64");
  } else {
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    b64 = btoa(binary);
  }
  return `redis_cloud:${b64}`;
}

export interface RedisIntegrationOptions {
  /** Redis Cloud account API key (defaults to REDIS_CLOUD_ACCOUNT_KEY) */
  accountKey?: string;
  /** Redis Cloud user secret key (defaults to REDIS_CLOUD_SECRET_KEY) */
  secretKey?: string;
}

export function redisIntegration(options: RedisIntegrationOptions = {}): MCPIntegration<"redis"> {
  const accountKey = options.accountKey ?? getEnv("REDIS_CLOUD_ACCOUNT_KEY");
  const secretKey = options.secretKey ?? getEnv("REDIS_CLOUD_SECRET_KEY");
  if (!accountKey || !secretKey) {
    throw new Error(
      "redisIntegration requires accountKey/secretKey or REDIS_CLOUD_ACCOUNT_KEY and REDIS_CLOUD_SECRET_KEY environment variables",
    );
  }

  const bearer = encodeRedisCloudBearerToken(accountKey, secretKey);

  return {
    id: "redis",
    name: "Redis Cloud",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/redis.png",
    description: "Manage Redis Cloud subscriptions, databases, async tasks, and audit logs via the REST API",
    category: "Infrastructure",
    tools: [...REDIS_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${bearer}`,
      };
    },

    async onInit(_client) {
      logger.debug("Redis Cloud integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Redis Cloud integration connected");
    },
  };
}

export type RedisTools = (typeof REDIS_TOOLS)[number];

export type { RedisIntegrationClient } from "./redis-client.js";
