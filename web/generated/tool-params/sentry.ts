/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SentryGetOrganizationParams { org_slug: string }

export interface SentryListOrgProjectsParams { org_slug: string; cursor?: string }

export interface SentryListOrgMembersParams { org_slug: string; cursor?: string }

export interface SentryGetProjectParams { org_slug: string; project_slug: string }

export interface SentryListIssuesParams { org_slug: string; project?: string; query?: string; sort?: string; limit?: number; cursor?: string }

export interface SentryGetIssueParams { issue_id: string }

export interface SentryUpdateIssueParams { issue_id: string; status?: "resolved" | "ignored" | "unresolved"; assignedTo?: string; hasSeen?: boolean; isBookmarked?: boolean }

export interface SentryListIssueEventsParams { issue_id: string; cursor?: string }

export interface SentryListProjectEventsParams { org_slug: string; project_slug: string; query?: string; cursor?: string }

export interface SentryListReleasesParams { org_slug: string; project?: string; query?: string; cursor?: string }

export interface SentryGetReleaseParams { org_slug: string; version: string }

export interface SentryCreateReleaseParams { org_slug: string; version: string; projects: string; ref?: string; url?: string; dateReleased?: string }

export interface SentryListReleaseCommitsParams { org_slug: string; version: string; cursor?: string }

export interface SentryResolveShortIdParams { org_slug: string; short_id: string }

