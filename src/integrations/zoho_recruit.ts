import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho Recruit");

const ZOHO_RECRUIT_SCOPES = [
  "ZohoRecruit.modules.ALL",
  "ZohoRecruit.settings.ALL",
] as const;

const ZOHO_RECRUIT_TOOLS = [
  "zoho_recruit_list_modules",
  "zoho_recruit_list_candidates",
  "zoho_recruit_get_candidate",
  "zoho_recruit_create_candidate",
  "zoho_recruit_list_job_openings",
  "zoho_recruit_list_interviews",
] as const;

export interface ZohoRecruitIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoRecruitIntegration(config: ZohoRecruitIntegrationConfig = {}): MCPIntegration<"zoho_recruit"> {
  const oauth: OAuthConfig = { provider: "zoho_recruit", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_RECRUIT_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_recruit", name: "Zoho Recruit", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_recruit.png", description: "Manage Zoho Recruit candidates, job openings, interviews, and custom modules", category: "HR & Recruiting", tools: [...ZOHO_RECRUIT_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho Recruit integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho Recruit integration connected"); },
  };
}

export type ZohoRecruitTools = (typeof ZOHO_RECRUIT_TOOLS)[number];
export type ZohoRecruitScopes = (typeof ZOHO_RECRUIT_SCOPES)[number];
export type { ZohoRecruitIntegrationClient } from "./zoho_recruit-client.js";
