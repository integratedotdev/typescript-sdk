import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("BambooHR");

const BAMBOOHR_SCOPES = [
  "employee.read",
  "employee.write",
  "time_off.read",
  "time_off.write",
] as const;

const BAMBOOHR_TOOLS = [
  "bamboohr_get_company_report",
  "bamboohr_list_employees",
  "bamboohr_get_employee",
  "bamboohr_update_employee",
  "bamboohr_list_time_off_requests",
  "bamboohr_create_time_off_request",
] as const;

export interface BamboohrIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  company_domain?: string;
}

export function bamboohrIntegration(config: BamboohrIntegrationConfig = {}): MCPIntegration<"bamboohr"> {
  const oauth: OAuthConfig = { provider: "bamboohr", clientId: config.clientId ?? getEnv("BAMBOOHR_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("BAMBOOHR_CLIENT_SECRET"), scopes: config.scopes ?? [...BAMBOOHR_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "bamboohr", name: "BambooHR", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/bamboohr.png", description: "Manage BambooHR get company report, list employees, get employee, update employee, list time off requests", category: "HR & Recruiting", tools: [...BAMBOOHR_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.company_domain) headers["X-BambooHR-Company-Domain"] = config.company_domain;
      return headers;
    },
    async onInit() { logger.debug("BambooHR integration initialized"); },
    async onAfterConnect() { logger.debug("BambooHR integration connected"); },
  };
}

export type BamboohrTools = (typeof BAMBOOHR_TOOLS)[number];
export type BamboohrScopes = (typeof BAMBOOHR_SCOPES)[number];
export type { BamboohrIntegrationClient } from "./bamboohr-client.js";
