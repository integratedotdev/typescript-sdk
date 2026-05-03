/**
 * Upstash Integration
 * Redis REST, QStash, and related APIs via API tokens (no OAuth).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Upstash");

const UPSTASH_TOOLS = [
  "upstash_redis_run",
  "upstash_redis_get",
  "upstash_redis_set",
  "upstash_redis_del",
  "upstash_qstash_publish",
] as const;

export interface UpstashIntegrationOptions {
  /** Upstash Redis REST URL (defaults to UPSTASH_REDIS_REST_URL) */
  redisUrl?: string;
  /** Upstash Redis REST token (defaults to UPSTASH_REDIS_REST_TOKEN) */
  redisToken?: string;
  /** QStash token (defaults to QSTASH_TOKEN) */
  qstashToken?: string;
}

export function upstashIntegration(options: UpstashIntegrationOptions = {}): MCPIntegration<"upstash"> {
  const redisUrl = options.redisUrl ?? getEnv("UPSTASH_REDIS_REST_URL");
  const redisToken = options.redisToken ?? getEnv("UPSTASH_REDIS_REST_TOKEN");
  const qstashToken = options.qstashToken ?? getEnv("QSTASH_TOKEN");

  const hasRedis = !!(redisUrl && redisToken);
  const onlyPartialRedis =
    (!!redisUrl && !redisToken) || (!redisUrl && !!redisToken);

  if (onlyPartialRedis) {
    throw new Error(
      "upstashIntegration requires both redisUrl and redisToken for Redis tools (or omit both for QStash-only)",
    );
  }

  if (!hasRedis && !qstashToken) {
    throw new Error(
      "upstashIntegration requires Redis credentials (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) and/or QSTASH_TOKEN",
    );
  }

  return {
    id: "upstash",
    name: "Upstash",
    logoUrl: "https://avatars.githubusercontent.com/u/74989412?s=200&v=4",
    description: "Serverless Redis (REST), QStash messaging, and HTTP APIs",
    category: "Infrastructure",
    tools: [...UPSTASH_TOOLS],
    authType: "apiKey",
    getHeaders() {
      const headers: Record<string, string> = {};
      if (hasRedis) {
        headers["X-Upstash-Redis-Rest-Url"] = redisUrl!;
        headers["X-Upstash-Redis-Rest-Token"] = redisToken!;
      }
      if (qstashToken) {
        headers["X-Qstash-Token"] = qstashToken;
      }
      return headers;
    },

    async onInit(_client) {
      logger.debug("Upstash integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Upstash integration connected");
    },
  };
}

export type UpstashTools = (typeof UPSTASH_TOOLS)[number];

export type { UpstashIntegrationClient } from "./upstash-client.js";
