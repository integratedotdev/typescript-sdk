/**
 * Sentry Integration Client Types
 * Fully typed interface for Sentry integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SentryIntegrationClient {
  // Organizations
  getOrganization(params: { org_slug: string }): Promise<MCPToolCallResponse>;
  listOrgProjects(params: { org_slug: string; cursor?: string }): Promise<MCPToolCallResponse>;
  listOrgMembers(params: { org_slug: string; cursor?: string }): Promise<MCPToolCallResponse>;

  // Projects
  getProject(params: { org_slug: string; project_slug: string }): Promise<MCPToolCallResponse>;

  // Issues & Events
  listIssues(params: { org_slug: string; project?: string; query?: string; sort?: string; limit?: number; cursor?: string }): Promise<MCPToolCallResponse>;
  getIssue(params: { issue_id: string }): Promise<MCPToolCallResponse>;
  updateIssue(params: { issue_id: string; status?: "resolved" | "ignored" | "unresolved"; assignedTo?: string; hasSeen?: boolean; isBookmarked?: boolean }): Promise<MCPToolCallResponse>;
  listIssueEvents(params: { issue_id: string; cursor?: string }): Promise<MCPToolCallResponse>;
  listProjectEvents(params: { org_slug: string; project_slug: string; query?: string; cursor?: string }): Promise<MCPToolCallResponse>;

  // Releases
  listReleases(params: { org_slug: string; project?: string; query?: string; cursor?: string }): Promise<MCPToolCallResponse>;
  getRelease(params: { org_slug: string; version: string }): Promise<MCPToolCallResponse>;
  createRelease(params: { org_slug: string; version: string; projects: string; ref?: string; url?: string; dateReleased?: string }): Promise<MCPToolCallResponse>;
  listReleaseCommits(params: { org_slug: string; version: string; cursor?: string }): Promise<MCPToolCallResponse>;

  // Utilities
  resolveShortId(params: { org_slug: string; short_id: string }): Promise<MCPToolCallResponse>;
}
