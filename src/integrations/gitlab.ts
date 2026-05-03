/**
 * GitLab Integration — OAuth and GitLab API tools (projects, issues, MRs, branches, milestones).
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("GitLab");

const GITLAB_TOOLS = [
  "gitlab_list_projects",
  "gitlab_list_own_projects",
  "gitlab_get_project",
  "gitlab_create_project",
  "gitlab_create_issue",
  "gitlab_list_issues",
  "gitlab_get_issue",
  "gitlab_update_issue",
  "gitlab_close_issue",
  "gitlab_create_merge_request",
  "gitlab_list_merge_requests",
  "gitlab_get_merge_request",
  "gitlab_accept_merge_request",
  "gitlab_list_branches",
  "gitlab_create_branch",
  "gitlab_list_commits",
  "gitlab_get_commit",
  "gitlab_list_issue_notes",
  "gitlab_create_issue_note",
  "gitlab_list_milestones",
  "gitlab_create_milestone",
  "gitlab_get_current_user",
] as const;

export interface GitLabIntegrationConfig {
  /** OAuth client ID (defaults to GITLAB_CLIENT_ID) */
  clientId?: string;
  /** OAuth client secret — server only (defaults to GITLAB_CLIENT_SECRET) */
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
  /** GitLab API base URL (default https://gitlab.com/api/v4/) */
  apiBaseUrl?: string;
}

export function gitlabIntegration(config: GitLabIntegrationConfig = {}): MCPIntegration<"gitlab"> {
  const oauth: OAuthConfig = {
    provider: "gitlab",
    clientId: config.clientId ?? getEnv("GITLAB_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("GITLAB_CLIENT_SECRET"),
    scopes: config.scopes ?? ["read_api", "write_api", "read_user"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl ?? "https://gitlab.com/api/v4/",
      ...config,
    },
  };

  return {
    id: "gitlab",
    name: "GitLab",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/gitlab.png",
    description: "Manage GitLab projects, issues, merge requests, and CI/CD",
    category: "Engineering",
    tools: [...GITLAB_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("GitLab integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("GitLab integration connected");
    },
  };
}

export type GitLabTools = (typeof GITLAB_TOOLS)[number];

export type { GitLabIntegrationClient } from "./gitlab-client.js";
