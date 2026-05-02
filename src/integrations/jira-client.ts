/**
 * Jira Integration Client Types
 * Fully typed interface for Jira integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: JiraUser;
  [key: string]: any;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: JiraStatus;
    assignee?: JiraUser;
    issuetype: JiraIssueType;
    priority?: JiraPriority;
    labels?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface JiraIssueType {
  id: string;
  name: string;
  subtask: boolean;
  [key: string]: any;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory?: Record<string, any>;
  [key: string]: any;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  active: boolean;
  [key: string]: any;
}

export interface JiraPriority {
  id: string;
  name: string;
  [key: string]: any;
}

export interface JiraTransition {
  id: string;
  name: string;
  to: JiraStatus;
  [key: string]: any;
}

export interface JiraBoard {
  id: number;
  name: string;
  type: "scrum" | "kanban";
  [key: string]: any;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: "future" | "active" | "closed";
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface JiraComment {
  id: string;
  body: any;
  author?: JiraUser;
  created: string;
  updated: string;
  [key: string]: any;
}

export interface JiraIntegrationClient {
  listProjects(params?: { startAt?: number; maxResults?: number; query?: string }): Promise<MCPToolCallResponse>;
  getProject(params: { project_key: string }): Promise<MCPToolCallResponse>;
  getIssueTypes(params: { project_key: string }): Promise<MCPToolCallResponse>;
  searchIssues(params: { jql: string; startAt?: number; maxResults?: number; fields?: string[] }): Promise<MCPToolCallResponse>;
  getIssue(params: { issue_key: string; fields?: string[] }): Promise<MCPToolCallResponse>;
  createIssue(params: { project_key: string; summary: string; issue_type: string; description?: string; assignee?: string; priority?: string; labels?: string[] }): Promise<MCPToolCallResponse>;
  updateIssue(params: { issue_key: string; summary?: string; description?: string; assignee?: string; priority?: string; labels?: string[] }): Promise<MCPToolCallResponse>;
  getTransitions(params: { issue_key: string }): Promise<MCPToolCallResponse>;
  transitionIssue(params: { issue_key: string; transition_id: string }): Promise<MCPToolCallResponse>;
  addComment(params: { issue_key: string; body: string }): Promise<MCPToolCallResponse>;
  assignIssue(params: { issue_key: string; account_id: string }): Promise<MCPToolCallResponse>;
  listBoards(params?: { projectKeyOrId?: string; startAt?: number; maxResults?: number }): Promise<MCPToolCallResponse>;
  listSprints(params: { board_id: number; state?: "future" | "active" | "closed"; startAt?: number; maxResults?: number }): Promise<MCPToolCallResponse>;
}
