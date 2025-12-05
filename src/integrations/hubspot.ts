/**
 * HubSpot Integration
 * Enables HubSpot tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

/**
 * HubSpot integration configuration
 * 
 * SERVER-SIDE: Automatically reads HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface HubSpotIntegrationConfig {
  /** HubSpot OAuth client ID (defaults to HUBSPOT_CLIENT_ID env var) */
  clientId?: string;
  /** HubSpot OAuth client secret (defaults to HUBSPOT_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: CRM scopes for contacts, companies, deals, tickets) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

/**
 * Default HubSpot tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const HUBSPOT_TOOLS = [
  "hubspot_list_contacts",
  "hubspot_get_contact",
  "hubspot_create_contact",
  "hubspot_update_contact",
  "hubspot_list_companies",
  "hubspot_get_company",
  "hubspot_create_company",
  "hubspot_list_deals",
  "hubspot_get_deal",
  "hubspot_create_deal",
  "hubspot_list_tickets",
  "hubspot_get_ticket",
] as const;


export function hubspotIntegration(config: HubSpotIntegrationConfig = {}): MCPIntegration<"hubspot"> {
  const oauth: OAuthConfig = {
    provider: "hubspot",
    clientId: config.clientId ?? getEnv('HUBSPOT_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('HUBSPOT_CLIENT_SECRET'),
    scopes: config.scopes || [
      "crm.objects.contacts.read",
      "crm.objects.contacts.write",
      "crm.objects.companies.read",
      "crm.objects.companies.write",
      "crm.objects.deals.read",
      "crm.objects.deals.write",
      "tickets",
    ],
    redirectUri: config.redirectUri,
    config: {
      ...config,
    },
  };

  return {
    id: "hubspot",
    tools: [...HUBSPOT_TOOLS],
    oauth,

    async onInit(_client) {
      console.log("HubSpot integration initialized");
    },

    async onAfterConnect(_client) {
      console.log("HubSpot integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type HubSpotTools = typeof HUBSPOT_TOOLS[number];

/**
 * Export HubSpot client types
 */
export type { HubSpotIntegrationClient } from "./hubspot-client.js";
