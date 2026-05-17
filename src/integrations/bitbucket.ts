import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Bitbucket");

const BITBUCKET_SCOPES = ["account", "repository", "pullrequest", "issue", "pipeline"] as const;

const BITBUCKET_TOOLS = [
  "bitbucket_get_current_user",
  "bitbucket_list_workspaces",
  "bitbucket_list_repositories",
  "bitbucket_get_repository",
  "bitbucket_list_branches",
  "bitbucket_list_commits",
  "bitbucket_get_commit",
  "bitbucket_list_pull_requests",
  "bitbucket_get_pull_request",
  "bitbucket_create_pull_request",
  "bitbucket_list_issues",
  "bitbucket_get_issue",
  "bitbucket_create_issue",
  "bitbucket_list_pipelines",
  "bitbucket_trigger_pipeline",
] as const;

export interface BitbucketIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function bitbucketIntegration(config: BitbucketIntegrationConfig = {}): MCPIntegration<"bitbucket"> {
  const oauth: OAuthConfig = {
    provider: "bitbucket",
    clientId: config.clientId ?? getEnv("BITBUCKET_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("BITBUCKET_CLIENT_SECRET"),
    scopes: config.scopes ?? [...BITBUCKET_SCOPES],
    redirectUri: config.redirectUri,
    config,
  };
  return {
    id: "bitbucket",
    name: "Bitbucket Cloud",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/bitbucket.png",
    description: "Manage Bitbucket Cloud workspaces, repositories, branches, commits, pull requests, issues, and pipelines",
    category: "Engineering",
    tools: [...BITBUCKET_TOOLS],
    authType: "oauth",
    oauth,
    async onInit() { logger.debug("Bitbucket integration initialized"); },
    async onAfterConnect() { logger.debug("Bitbucket integration connected"); },
  };
}

export type BitbucketTools = (typeof BITBUCKET_TOOLS)[number];
export type BitbucketScopes = (typeof BITBUCKET_SCOPES)[number];
export type { BitbucketIntegrationClient } from "./bitbucket-client.js";

