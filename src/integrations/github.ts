/**
 * GitHub Integration
 * Enables GitHub tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('GitHub');

/**
 * GitHub integration configuration
 * 
 * SERVER-SIDE: Automatically reads GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from environment.
 * You can override by providing explicit clientId and clientSecret values.
 * CLIENT-SIDE: Omit clientId and clientSecret when using createMCPClient()
 */
export interface GitHubIntegrationConfig {
  /** GitHub OAuth client ID (defaults to GITHUB_CLIENT_ID env var) */
  clientId?: string;
  /** GitHub OAuth client secret (defaults to GITHUB_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Additional OAuth scopes (default: ['repo', 'user']) */
  scopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
  /** GitHub API base URL (default: https://api.github.com) */
  apiBaseUrl?: string;
}

/**
 * Default GitHub tools that this integration enables
 * These should match the tool names exposed by your MCP server
 */
const GITHUB_TOOLS = [
  "github_create_issue",
  "github_list_issues",
  "github_get_issue",
  "github_update_issue",
  "github_close_issue",
  "github_create_pull_request",
  "github_list_pull_requests",
  "github_get_pull_request",
  "github_merge_pull_request",
  "github_list_repos",
  "github_list_own_repos",
  "github_get_repo",
  "github_create_repo",
  "github_list_branches",
  "github_create_branch",
  "github_get_user",
  "github_list_commits",
  "github_get_commit",
  "github_list_issue_comments",
  "github_add_issue_comment",
  "github_update_issue_comment",
  "github_delete_issue_comment",
  "github_list_pr_files",
  "github_list_pr_commits",
  "github_list_pr_reviews",
  "github_create_pr_review",
  "github_list_pr_review_comments",
  "github_get_file_contents",
  "github_create_or_update_file",
  "github_delete_file",
  "github_list_releases",
  "github_get_release",
  "github_get_latest_release",
  "github_create_release",
  "github_list_labels",
  "github_create_label",
  "github_add_issue_labels",
  "github_list_collaborators",
  "github_fork_repo",
  "github_search_repos",
  "github_search_issues",
  "github_search_code",
  "github_list_workflows",
  "github_list_workflow_runs",
  "github_trigger_workflow",
  "github_list_milestones",
  "github_create_milestone",
] as const;


export function githubIntegration(config: GitHubIntegrationConfig = {}): MCPIntegration<"github"> {
  const oauth: OAuthConfig = {
    provider: "github",
    clientId: config.clientId ?? getEnv('GITHUB_CLIENT_ID'),
    clientSecret: config.clientSecret ?? getEnv('GITHUB_CLIENT_SECRET'),
    scopes: config.scopes || ["repo", "user"],
    redirectUri: config.redirectUri,
    config: {
      apiBaseUrl: config.apiBaseUrl || "https://api.github.com",
      ...config,
    },
  };

  return {
    id: "github",
    name: "GitHub",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/github.png",
    tools: [...GITHUB_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("GitHub integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("GitHub integration connected");
    },
  };
}

/**
 * Export tool names for type inference
 */
export type GitHubTools = typeof GITHUB_TOOLS[number];

/**
 * Export GitHub client types
 */
export type { GitHubIntegrationClient } from "./github-client.js";

