/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BitbucketListWorkspacesParams { q?: string; sort?: string; pagelen?: number; page?: number }

export interface BitbucketListRepositoriesParams { workspace: string; q?: string; sort?: string; role?: string; pagelen?: number; page?: number }

export interface BitbucketGetRepositoryParams { workspace: string; repo_slug: string }

export interface BitbucketListBranchesParams { workspace: string; repo_slug: string; q?: string; sort?: string; pagelen?: number; page?: number }

export interface BitbucketListCommitsParams { workspace: string; repo_slug: string; include?: string; exclude?: string; path?: string; pagelen?: number; page?: number }

export interface BitbucketGetCommitParams { workspace: string; repo_slug: string; commit: string }

export interface BitbucketListPullRequestsParams { workspace: string; repo_slug: string; state?: string; q?: string; sort?: string; pagelen?: number; page?: number }

export interface BitbucketGetPullRequestParams { workspace: string; repo_slug: string; pull_request_id: string }

export interface BitbucketCreatePullRequestParams { workspace: string; repo_slug: string; pull_request_json: string }

export interface BitbucketListIssuesParams { workspace: string; repo_slug: string; q?: string; sort?: string; pagelen?: number; page?: number }

export interface BitbucketGetIssueParams { workspace: string; repo_slug: string; issue_id: string }

export interface BitbucketCreateIssueParams { workspace: string; repo_slug: string; issue_json: string }

export interface BitbucketListPipelinesParams { workspace: string; repo_slug: string; sort?: string; pagelen?: number; page?: number }

export interface BitbucketTriggerPipelineParams { workspace: string; repo_slug: string; pipeline_json: string }

