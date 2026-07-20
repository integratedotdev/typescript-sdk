/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface JiraListProjectsParams { startAt?: number; maxResults?: number; query?: string }

export interface JiraGetProjectParams { project_key: string }

export interface JiraGetIssueTypesParams { project_key: string }

export interface JiraSearchIssuesParams { jql: string; startAt?: number; maxResults?: number; fields?: string[] }

export interface JiraGetIssueParams { issue_key: string; fields?: string[] }

export interface JiraCreateIssueParams { project_key: string; summary: string; issue_type: string; description?: string; assignee?: string; priority?: string; labels?: string[] }

export interface JiraUpdateIssueParams { issue_key: string; summary?: string; description?: string; assignee?: string; priority?: string; labels?: string[] }

export interface JiraGetTransitionsParams { issue_key: string }

export interface JiraTransitionIssueParams { issue_key: string; transition_id: string }

export interface JiraAddCommentParams { issue_key: string; body: string }

export interface JiraAssignIssueParams { issue_key: string; account_id: string }

export interface JiraListBoardsParams { projectKeyOrId?: string; startAt?: number; maxResults?: number }

export interface JiraListSprintsParams { board_id: number; state?: "future" | "active" | "closed"; startAt?: number; maxResults?: number }

