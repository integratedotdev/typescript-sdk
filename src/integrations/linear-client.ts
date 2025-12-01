/**
 * Linear Integration Client Types
 * Fully typed interface for Linear integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Linear Issue
 */
export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: number;
  priorityLabel: string;
  state: {
    id: string;
    name: string;
    type: string;
    color: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  team: {
    id: string;
    name: string;
    key: string;
  };
  project?: {
    id: string;
    name: string;
  };
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  canceledAt?: string;
  dueDate?: string;
  url: string;
}

/**
 * Linear Project
 */
export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  state: string;
  progress: number;
  startDate?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

/**
 * Linear Team
 */
export interface LinearTeam {
  id: string;
  name: string;
  key: string;
  description?: string;
  icon?: string;
  color?: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Label
 */
export interface LinearLabel {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Comment
 */
export interface LinearComment {
  id: string;
  body: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Integration Client Interface
 * Provides type-safe methods for all Linear operations
 */
export interface LinearIntegrationClient {
  /**
   * Create a new issue in Linear
   * 
   * @example
   * ```typescript
   * const issue = await client.linear.createIssue({
   *   teamId: "team-id",
   *   title: "Fix authentication bug",
   *   description: "Users are unable to login"
   * });
   * ```
   */
  createIssue(params: {
    /** Team ID to create the issue in */
    teamId: string;
    /** Issue title */
    title: string;
    /** Issue description (markdown supported) */
    description?: string;
    /** Priority (0 = no priority, 1 = urgent, 2 = high, 3 = normal, 4 = low) */
    priority?: number;
    /** Assignee user ID */
    assigneeId?: string;
    /** Project ID */
    projectId?: string;
    /** Label IDs */
    labelIds?: string[];
    /** Due date (ISO 8601) */
    dueDate?: string;
    /** State ID */
    stateId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List issues in Linear
   * 
   * @example
   * ```typescript
   * const issues = await client.linear.listIssues({
   *   teamId: "team-id",
   *   first: 50
   * });
   * ```
   */
  listIssues(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Project ID to filter by */
    projectId?: string;
    /** Assignee user ID to filter by */
    assigneeId?: string;
    /** State IDs to filter by */
    stateIds?: string[];
    /** Label IDs to filter by */
    labelIds?: string[];
    /** Number of issues to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
    /** Include archived issues */
    includeArchived?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific issue by ID or identifier
   * 
   * @example
   * ```typescript
   * const issue = await client.linear.getIssue({
   *   issueId: "ABC-123"
   * });
   * ```
   */
  getIssue(params: {
    /** Issue ID or identifier (e.g., "ABC-123") */
    issueId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing issue
   * 
   * @example
   * ```typescript
   * await client.linear.updateIssue({
   *   issueId: "issue-id",
   *   title: "Updated title",
   *   priority: 1
   * });
   * ```
   */
  updateIssue(params: {
    /** Issue ID to update */
    issueId: string;
    /** New title */
    title?: string;
    /** New description */
    description?: string;
    /** New priority */
    priority?: number;
    /** New assignee user ID */
    assigneeId?: string;
    /** New state ID */
    stateId?: string;
    /** New project ID */
    projectId?: string;
    /** New label IDs */
    labelIds?: string[];
    /** New due date */
    dueDate?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List projects in Linear
   * 
   * @example
   * ```typescript
   * const projects = await client.linear.listProjects({
   *   first: 20
   * });
   * ```
   */
  listProjects(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of projects to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
    /** Include archived projects */
    includeArchived?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * List teams in Linear
   * 
   * @example
   * ```typescript
   * const teams = await client.linear.listTeams({
   *   first: 20
   * });
   * ```
   */
  listTeams(params?: {
    /** Number of teams to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a comment to an issue
   * 
   * @example
   * ```typescript
   * await client.linear.addComment({
   *   issueId: "issue-id",
   *   body: "This is a comment"
   * });
   * ```
   */
  addComment(params: {
    /** Issue ID to comment on */
    issueId: string;
    /** Comment body (markdown supported) */
    body: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List labels in Linear
   * 
   * @example
   * ```typescript
   * const labels = await client.linear.listLabels({
   *   teamId: "team-id"
   * });
   * ```
   */
  listLabels(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of labels to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for issues
   * 
   * @example
   * ```typescript
   * const results = await client.linear.searchIssues({
   *   query: "authentication bug"
   * });
   * ```
   */
  searchIssues(params: {
    /** Search query */
    query: string;
    /** Team ID to filter by */
    teamId?: string;
    /** Include archived issues */
    includeArchived?: boolean;
    /** Number of results to return */
    first?: number;
  }): Promise<MCPToolCallResponse>;
}

