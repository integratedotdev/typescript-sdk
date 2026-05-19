import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Azure DevOps");

const AZURE_DEVOPS_SCOPES = [
  "vso.profile",
  "vso.project",
  "vso.code_write",
  "vso.build",
  "vso.work_write",
] as const;

const AZURE_DEVOPS_TOOLS = [
  "azure_devops_list_projects",
  "azure_devops_list_repositories",
  "azure_devops_list_pull_requests",
  "azure_devops_list_builds",
  "azure_devops_queue_build",
  "azure_devops_get_work_item",
] as const;

export interface AzureDevopsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function azureDevopsIntegration(config: AzureDevopsIntegrationConfig = {}): MCPIntegration<"azure_devops"> {
  const oauth: OAuthConfig = { provider: "azure_devops", clientId: config.clientId ?? getEnv("AZURE_DEVOPS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("AZURE_DEVOPS_CLIENT_SECRET"), scopes: config.scopes ?? [...AZURE_DEVOPS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "azure_devops", name: "Azure DevOps", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/azure_devops.png", description: "Manage Azure DevOps projects, repositories, pull requests, builds, and work items", category: "Engineering", tools: [...AZURE_DEVOPS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Azure DevOps integration initialized"); },
    async onAfterConnect() { logger.debug("Azure DevOps integration connected"); },
  };
}

export type AzureDevopsTools = (typeof AZURE_DEVOPS_TOOLS)[number];
export type AzureDevopsScopes = (typeof AZURE_DEVOPS_SCOPES)[number];
export type { AzureDevopsIntegrationClient } from "./azure_devops-client.js";
