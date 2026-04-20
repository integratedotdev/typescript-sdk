/**
 * Word Integration
 * Enables Word document tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('Word');

export interface WordIntegrationConfig {
  /** Microsoft OAuth client ID (defaults to WORD_CLIENT_ID env var) */
  clientId?: string;
  /** Microsoft OAuth client secret (defaults to WORD_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes */
  scopes?: string[];
  /** Optional OAuth scopes */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const WORD_TOOLS = [
  "word_list",
  "word_get",
  "word_create",
  "word_copy",
  "word_delete",
  "word_share",
] as const;

export function wordIntegration(config: WordIntegrationConfig = {}): MCPIntegration<"word"> {
  const oauth: OAuthConfig = {
    provider: "word",
    clientId: config.clientId ?? getEnv('WORD_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('WORD_CLIENT_SECRET'),
    scopes: config.scopes,
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config,
  };

  return {
    id: "word",
    name: "Word",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/word.png",
    tools: [...WORD_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("Word integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Word integration connected");
    },
  };
}

export type WordTools = typeof WORD_TOOLS[number];
export type { WordIntegrationClient } from "./word-client.js";
