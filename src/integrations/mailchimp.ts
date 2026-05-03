import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const MAILCHIMP_TOOLS = [
  "mailchimp_ping",
  "mailchimp_list_audiences",
  "mailchimp_get_audience",
  "mailchimp_list_members",
  "mailchimp_get_member",
  "mailchimp_add_or_update_member",
  "mailchimp_archive_member",
  "mailchimp_list_campaigns",
] as const;

export interface MailchimpIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function mailchimpIntegration(config: MailchimpIntegrationConfig = {}): MCPIntegration<"mailchimp"> {
  const oauth: OAuthConfig = {
    provider: "mailchimp",
    clientId: config.clientId ?? getEnv("MAILCHIMP_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("MAILCHIMP_CLIENT_SECRET"),
    scopes: config.scopes ?? [],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
  };

  return {
    id: "mailchimp",
    name: "Mailchimp",
    tools: [...MAILCHIMP_TOOLS],
    oauth,
  };
}

export type MailchimpTools = (typeof MAILCHIMP_TOOLS)[number];
export type { MailchimpIntegrationClient } from "./mailchimp-client.js";
