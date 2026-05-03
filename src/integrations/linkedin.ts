import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("LinkedIn");

const LINKEDIN_SCOPES = ["openid", "profile", "email", "w_member_social"] as const;

const LINKEDIN_TOOLS = ["linkedin_get_userinfo", "linkedin_create_post"] as const;

export interface LinkedInIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function linkedinIntegration(config: LinkedInIntegrationConfig = {}): MCPIntegration<"linkedin"> {
  const oauth: OAuthConfig = {
    provider: "linkedin",
    clientId: config.clientId ?? getEnv("LINKEDIN_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("LINKEDIN_CLIENT_SECRET"),
    scopes: config.scopes ?? [...LINKEDIN_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://www.linkedin.com/oauth/v2/authorization",
      token_endpoint: "https://www.linkedin.com/oauth/v2/accessToken",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "linkedin",
    name: "LinkedIn",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/linkedin.png",
    description: "Read LinkedIn OpenID profile data and publish member posts",
    category: "Social Media",
    tools: [...LINKEDIN_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("LinkedIn integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("LinkedIn integration connected");
    },
  };
}

export type LinkedInTools = (typeof LINKEDIN_TOOLS)[number];
export type LinkedInScopes = (typeof LINKEDIN_SCOPES)[number];
export type { LinkedInIntegrationClient } from "./linkedin-client.js";
