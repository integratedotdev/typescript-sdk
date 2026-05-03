/**
 * Cloudflare integration — OAuth (dashboard) or API token (Bearer) against api.cloudflare.com/client/v4.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Cloudflare");

const CLOUDFLARE_TOOLS = [
  "cloudflare_verify_token",
  "cloudflare_get_user",
  "cloudflare_list_accounts",
  "cloudflare_get_account",
  "cloudflare_list_zones",
  "cloudflare_get_zone",
  "cloudflare_list_dns_records",
  "cloudflare_create_dns_record",
  "cloudflare_update_dns_record",
  "cloudflare_delete_dns_record",
  "cloudflare_purge_zone_cache",
  "cloudflare_list_worker_scripts",
] as const;

export interface CloudflareIntegrationConfig {
  /**
   * When set (or `CLOUDFLARE_API_TOKEN`), the integration uses static Bearer auth
   * instead of OAuth — ideal for workers, CI, and server-only API tokens.
   */
  apiToken?: string;
  /** OAuth client ID (`CLOUDFLARE_CLIENT_ID`) — register an app in the Cloudflare dashboard. */
  clientId?: string;
  /** OAuth client secret (`CLOUDFLARE_CLIENT_SECRET`) — omit for PKCE-only public clients. */
  clientSecret?: string;
  redirectUri?: string;
  /** Override default OAuth scopes (space-separated scope names match Wrangler / dashboard OAuth). */
  scopes?: string[];
}

const DEFAULT_SCOPES = [
  "account:read",
  "user:read",
  "zone:read",
  "workers:read",
  "workers:write",
  "pages:write",
  "offline_access",
] as const;

export function cloudflareIntegration(
  config: CloudflareIntegrationConfig = {},
): MCPIntegration<"cloudflare"> {
  const apiToken = config.apiToken ?? getEnv("CLOUDFLARE_API_TOKEN");

  if (apiToken && apiToken.trim() !== "") {
    return {
      id: "cloudflare",
      name: "Cloudflare",
      logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/cloudflare.png",
      description: "Manage Cloudflare zones, DNS, cache, and Workers via the Cloudflare API",
      category: "Infrastructure",
      tools: [...CLOUDFLARE_TOOLS],
      authType: "apiKey",
      getHeaders() {
        return { Authorization: `Bearer ${apiToken.trim()}` };
      },
      async onInit(_client) {
        logger.debug("Cloudflare integration initialized (API token)");
      },
      async onAfterConnect(_client) {
        logger.debug("Cloudflare integration connected");
      },
    };
  }

  const oauth: OAuthConfig = {
    provider: "cloudflare",
    clientId: config.clientId ?? getEnv("CLOUDFLARE_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("CLOUDFLARE_CLIENT_SECRET"),
    scopes: config.scopes?.length ? config.scopes : [...DEFAULT_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://dash.cloudflare.com/oauth2/auth",
      token_endpoint: "https://dash.cloudflare.com/oauth2/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "cloudflare",
    name: "Cloudflare",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/cloudflare.png",
    description: "Manage Cloudflare zones, DNS, cache, and Workers via the Cloudflare API",
    category: "Infrastructure",
    tools: [...CLOUDFLARE_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("Cloudflare integration initialized (OAuth)");
    },
    async onAfterConnect(_client) {
      logger.debug("Cloudflare integration connected");
    },
  };
}

export type CloudflareTools = (typeof CLOUDFLARE_TOOLS)[number];

export type { CloudflareIntegrationClient } from "./cloudflare-client.js";
