/**
 * Datadog Integration
 * OAuth or API key + application key authentication for Datadog observability APIs
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Datadog");

const DATADOG_SCOPES = [
  "monitors_read",
  "dashboards_read",
  "metrics_read",
  "logs_read_data",
] as const;

const DATADOG_TOOLS = [
  "datadog_list_monitors",
  "datadog_get_monitor",
  "datadog_list_dashboards",
  "datadog_get_dashboard",
  "datadog_search_logs",
] as const;

function normalizeSite(raw?: string): string {
  const s = (raw ?? "").trim();
  return s.length > 0 ? s : "datadoghq.com";
}

export interface DatadogIntegrationConfig {
  /** OAuth client ID (defaults to DATADOG_CLIENT_ID) */
  clientId?: string;
  /** OAuth client secret (defaults to DATADOG_CLIENT_SECRET) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  redirectUri?: string;
  /**
   * Datadog site / region (e.g. datadoghq.com, datadoghq.eu, us3.datadoghq.com).
   * Forwarded for regional OAuth and API hosts.
   */
  site?: string;
  /** API key (with applicationKey selects API-key auth instead of OAuth; defaults to DATADOG_API_KEY) */
  apiKey?: string;
  /** Application key (defaults to DATADOG_APPLICATION_KEY) */
  applicationKey?: string;
}

export function datadogIntegration(config: DatadogIntegrationConfig = {}): MCPIntegration<"datadog"> {
  const site = normalizeSite(config.site ?? getEnv("DATADOG_SITE"));

  const apiKey = config.apiKey ?? getEnv("DATADOG_API_KEY");
  const applicationKey = config.applicationKey ?? getEnv("DATADOG_APPLICATION_KEY");

  const baseFields = {
    id: "datadog" as const,
    name: "Datadog",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/datadog.png",
    description: "List monitors and dashboards and search logs with the Datadog API",
    category: "Engineering",
    tools: [...DATADOG_TOOLS],
    async onInit(_client: unknown) {
      logger.debug("Datadog integration initialized");
    },
    async onAfterConnect(_client: unknown) {
      logger.debug("Datadog integration connected");
    },
  };

  if (apiKey || applicationKey) {
    if (!apiKey || !applicationKey) {
      throw new Error(
        "datadogIntegration: apiKey and applicationKey must both be set for API key authentication"
      );
    }
    return {
      ...baseFields,
      authType: "apiKey" as const,
      getHeaders() {
        return {
          "DD-API-KEY": apiKey,
          "DD-APPLICATION-KEY": applicationKey,
          "DD-SITE": site,
        };
      },
    };
  }

  const clientId = config.clientId ?? getEnv("DATADOG_CLIENT_ID");
  const clientSecret = config.clientSecret ?? getEnv("DATADOG_CLIENT_SECRET");

  const oauth: OAuthConfig = {
    provider: "datadog",
    clientId,
    clientSecret,
    scopes: config.scopes ?? [...DATADOG_SCOPES],
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://app.datadoghq.com/oauth2/v1/authorize",
      token_endpoint: "https://api.datadoghq.com/oauth2/v1/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
      subdomain: site,
    },
  };

  return {
    ...baseFields,
    oauth,
  };
}

export type DatadogTools = (typeof DATADOG_TOOLS)[number];
export type DatadogScopes = (typeof DATADOG_SCOPES)[number];

export type { DatadogIntegrationClient } from "./datadog-client.js";
