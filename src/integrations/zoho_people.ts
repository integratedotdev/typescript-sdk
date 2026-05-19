import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Zoho People");

const ZOHO_PEOPLE_SCOPES = [
  "ZohoPeople.forms.ALL",
  "ZohoPeople.employee.ALL",
  "ZohoPeople.leave.ALL",
  "ZohoPeople.attendance.ALL",
] as const;

const ZOHO_PEOPLE_TOOLS = [
  "zoho_people_list_forms",
  "zoho_people_list_employees",
  "zoho_people_get_employee",
  "zoho_people_list_attendance",
  "zoho_people_list_leave_requests",
  "zoho_people_list_time_logs",
] as const;

export interface ZohoPeopleIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  region?: string;
}

export function zohoPeopleIntegration(config: ZohoPeopleIntegrationConfig = {}): MCPIntegration<"zoho_people"> {
  const oauth: OAuthConfig = { provider: "zoho_people", clientId: config.clientId ?? getEnv("ZOHO_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ZOHO_CLIENT_SECRET"), scopes: config.scopes ?? [...ZOHO_PEOPLE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "zoho_people", name: "Zoho People", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/zoho_people.png", description: "Manage Zoho People forms, employees, attendance, leave requests, and time tracking", category: "HR & Recruiting", tools: [...ZOHO_PEOPLE_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const region = config.region ?? getEnv("ZOHO_REGION");
      const headers: Record<string, string> = {};
      if (region) headers["X-Zoho-Region"] = region;
      return headers;
    },
    async onInit() { logger.debug("Zoho People integration initialized"); },
    async onAfterConnect() { logger.debug("Zoho People integration connected"); },
  };
}

export type ZohoPeopleTools = (typeof ZOHO_PEOPLE_TOOLS)[number];
export type ZohoPeopleScopes = (typeof ZOHO_PEOPLE_SCOPES)[number];
export type { ZohoPeopleIntegrationClient } from "./zoho_people-client.js";
