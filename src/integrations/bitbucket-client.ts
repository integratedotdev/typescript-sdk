import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BitbucketIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkspaces(params?: { q?: string; sort?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  listRepositories(params: { workspace: string; q?: string; sort?: string; role?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  getRepository(params: { workspace: string; repo_slug: string }): Promise<MCPToolCallResponse>;
  listBranches(params: { workspace: string; repo_slug: string; q?: string; sort?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  listCommits(params: { workspace: string; repo_slug: string; include?: string; exclude?: string; path?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  getCommit(params: { workspace: string; repo_slug: string; commit: string }): Promise<MCPToolCallResponse>;
  listPullRequests(params: { workspace: string; repo_slug: string; state?: string; q?: string; sort?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  getPullRequest(params: { workspace: string; repo_slug: string; pull_request_id: string }): Promise<MCPToolCallResponse>;
  createPullRequest(params: { workspace: string; repo_slug: string; pull_request_json: string }): Promise<MCPToolCallResponse>;
  listIssues(params: { workspace: string; repo_slug: string; q?: string; sort?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  getIssue(params: { workspace: string; repo_slug: string; issue_id: string }): Promise<MCPToolCallResponse>;
  createIssue(params: { workspace: string; repo_slug: string; issue_json: string }): Promise<MCPToolCallResponse>;
  listPipelines(params: { workspace: string; repo_slug: string; sort?: string; pagelen?: number; page?: number }): Promise<MCPToolCallResponse>;
  triggerPipeline(params: { workspace: string; repo_slug: string; pipeline_json: string }): Promise<MCPToolCallResponse>;
}

