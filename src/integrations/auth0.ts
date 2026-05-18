/**
 * Auth0 Integration
 * Auth0 Management API with bearer token (M2M client credentials or pre-issued token).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Auth0");

const AUTH0_TOOLS = [
  "auth0_list_users",
  "auth0_get_user",
  "auth0_create_user",
  "auth0_patch_user",
  "auth0_delete_user",
  "auth0_list_connections",
  "auth0_get_connection",
  "auth0_list_clients",
  "auth0_get_client",
  "auth0_create_client",
  "auth0_patch_client",
] as const;

function normalizeAuth0Domain(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^https?:\/\//i, "");
  const slash = s.indexOf("/");
  if (slash >= 0) s = s.slice(0, slash);
  return s.replace(/\/$/, "");
}

async function fetchClientCredentialsToken(params: {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
}): Promise<{ access_token: string; expires_in?: number }> {
  const tokenUrl = `https://${params.domain}/oauth/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    audience: params.audience,
  });
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Auth0 token request failed (${res.status}): ${text}`);
  }
  const data = JSON.parse(text) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error("Auth0 token response missing access_token");
  }
  return data as { access_token: string; expires_in?: number };
}

export interface Auth0IntegrationOptions {
  /** Tenant domain host (e.g. dev-xxx.us.auth0.com) */
  domain: string;
  /** Management API access token (if omitted, clientId + clientSecret must be set) */
  accessToken?: string;
  /** M2M application client ID (defaults to AUTH0_CLIENT_ID) */
  clientId?: string;
  /** M2M application client secret (defaults to AUTH0_CLIENT_SECRET) */
  clientSecret?: string;
  /** Token audience (defaults to https://{domain}/api/v2/) */
  audience?: string;
}

export function auth0Integration(options: Auth0IntegrationOptions): MCPIntegration<"auth0"> {
  const domain = normalizeAuth0Domain(options.domain);
  if (!domain) {
    throw new Error("auth0Integration requires domain (tenant host)");
  }

  const clientId = options.clientId ?? getEnv("AUTH0_CLIENT_ID");
  const clientSecret = options.clientSecret ?? getEnv("AUTH0_CLIENT_SECRET");
  const initialToken = options.accessToken ?? getEnv("AUTH0_ACCESS_TOKEN") ?? "";

  if (!initialToken && (!clientId || !clientSecret)) {
    throw new Error(
      "auth0Integration requires accessToken (or AUTH0_ACCESS_TOKEN) or both clientId/clientSecret (or AUTH0_CLIENT_ID / AUTH0_CLIENT_SECRET)"
    );
  }

  let accessToken = initialToken;
  let tokenExpiresAtMs = 0;

  async function ensureFreshToken(): Promise<void> {
    if (!clientId || !clientSecret) return;
    if (accessToken && Date.now() < tokenExpiresAtMs - 60_000) return;
    const audience =
      options.audience?.trim() || `https://${domain}/api/v2/`;
    const tok = await fetchClientCredentialsToken({
      domain,
      clientId,
      clientSecret,
      audience,
    });
    accessToken = tok.access_token;
    const sec = typeof tok.expires_in === "number" && tok.expires_in > 0 ? tok.expires_in : 86400;
    tokenExpiresAtMs = Date.now() + sec * 1000;
  }

  return {
    id: "auth0",
    name: "Auth0",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/auth0.png",
    description: "Manage Auth0 users, connections, and applications via the Management API",
    category: "Identity & Access",
    tools: [...AUTH0_TOOLS],
    authType: "apiKey",

    getHeaders() {
      return {
        Authorization: `Bearer ${accessToken}`,
        "X-Auth0-Domain": domain,
      };
    },

    async onInit() {
      logger.debug("Auth0 integration initialized");
    },

    async onBeforeConnect() {
      await ensureFreshToken();
      if (!accessToken) {
        throw new Error("Auth0 access token is not configured");
      }
    },

    async onAfterConnect() {
      logger.debug("Auth0 integration connected");
    },
  };
}

export type Auth0Tools = (typeof AUTH0_TOOLS)[number];

export type { Auth0IntegrationClient } from "./auth0-client.js";
