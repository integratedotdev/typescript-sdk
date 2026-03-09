/**
 * GitHub Integration Client Types
 * Fully typed interface for GitHub integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * GitHub Issue
 */
export interface GitHubIssue {
  number: number;
  title: string;
  body?: string;
  state: "open" | "closed";
  html_url: string;
  user?: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at?: string;
  labels?: Array<{
    name: string;
    color: string;
  }>;
}

/**
 * GitHub Pull Request
 */
export interface GitHubPullRequest {
  number: number;
  title: string;
  body?: string;
  state: "open" | "closed" | "merged";
  html_url: string;
  user?: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  merged_at?: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
}

/**
 * GitHub Repository
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language?: string;
  default_branch: string;
}

/**
 * GitHub Branch
 */
export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

/**
 * GitHub User
 */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  email?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

/**
 * GitHub Commit
 */
export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
  author?: {
    login: string;
    avatar_url: string;
  };
  committer?: {
    login: string;
    avatar_url: string;
  };
}

/**
 * GitHub Issue Comment
 */
export interface GitHubIssueComment {
  id: number;
  body: string;
  user?: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

/**
 * GitHub PR File
 */
export interface GitHubPRFile {
  filename: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  patch?: string;
}

/**
 * GitHub PR Review
 */
export interface GitHubPRReview {
  id: number;
  user?: {
    login: string;
    avatar_url: string;
  };
  body?: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING";
  submitted_at?: string;
  html_url: string;
}

/**
 * GitHub PR Review Comment
 */
export interface GitHubPRReviewComment {
  id: number;
  body: string;
  path: string;
  line?: number;
  user?: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

/**
 * GitHub File Contents
 */
export interface GitHubFileContents {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  sha: string;
  size: number;
  content?: string;
  encoding?: string;
  html_url: string;
  download_url?: string;
}

/**
 * GitHub Release
 */
export interface GitHubRelease {
  id: number;
  tag_name: string;
  name?: string;
  body?: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at?: string;
  html_url: string;
  author?: {
    login: string;
    avatar_url: string;
  };
}

/**
 * GitHub Label
 */
export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
  default: boolean;
}

/**
 * GitHub Collaborator
 */
export interface GitHubCollaborator {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  permissions?: {
    pull: boolean;
    push: boolean;
    admin: boolean;
  };
}

/**
 * GitHub Search Result
 */
export interface GitHubSearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

/**
 * GitHub Workflow
 */
export interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: "active" | "deleted" | "disabled_fork" | "disabled_inactivity" | "disabled_manually";
  created_at: string;
  updated_at: string;
  html_url: string;
}

/**
 * GitHub Workflow Run
 */
export interface GitHubWorkflowRun {
  id: number;
  name?: string;
  status: "queued" | "in_progress" | "completed" | "waiting" | "requested" | "pending";
  conclusion?: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  head_branch?: string;
  head_sha: string;
  event: string;
}

/**
 * GitHub Milestone
 */
export interface GitHubMilestone {
  id: number;
  number: number;
  title: string;
  description?: string;
  state: "open" | "closed";
  due_on?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  open_issues: number;
  closed_issues: number;
  html_url: string;
}

/**
 * GitHub Integration Client Interface
 * Provides type-safe methods for all GitHub operations
 */
export interface GitHubIntegrationClient {
  /**
   * Create a new issue in a repository
   */
  createIssue(params: {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * List issues in a repository
   */
  listIssues(params: {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    labels?: string[];
    sort?: "created" | "updated" | "comments";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific issue
   */
  getIssue(params: {
    owner: string;
    repo: string;
    issue_number: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing issue
   */
  updateIssue(params: {
    owner: string;
    repo: string;
    issue_number: number;
    title?: string;
    body?: string;
    state?: "open" | "closed";
    labels?: string[];
    assignees?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Close an issue
   */
  closeIssue(params: {
    owner: string;
    repo: string;
    issue_number: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a pull request
   */
  createPullRequest(params: {
    owner: string;
    repo: string;
    title: string;
    head: string;
    base: string;
    body?: string;
    draft?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * List pull requests in a repository
   */
  listPullRequests(params: {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    sort?: "created" | "updated" | "popularity" | "long-running";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific pull request
   */
  getPullRequest(params: {
    owner: string;
    repo: string;
    pull_number: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Merge a pull request
   */
  mergePullRequest(params: {
    owner: string;
    repo: string;
    pull_number: number;
    commit_title?: string;
    commit_message?: string;
    merge_method?: "merge" | "squash" | "rebase";
  }): Promise<MCPToolCallResponse>;

  /**
   * List repositories (for a user or organization)
   */
  listRepos(params: {
    owner: string;
    type?: "all" | "owner" | "member";
    sort?: "created" | "updated" | "pushed" | "full_name";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List repositories for the authenticated user
   */
  listOwnRepos(params?: {
    visibility?: "all" | "public" | "private";
    affiliation?: string;
    type?: "all" | "owner" | "public" | "private" | "member";
    sort?: "created" | "updated" | "pushed" | "full_name";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific repository
   */
  getRepo(params: {
    owner: string;
    repo: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new repository
   */
  createRepo(params: {
    name: string;
    description?: string;
    private?: boolean;
    auto_init?: boolean;
    gitignore_template?: string;
    license_template?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List branches in a repository
   */
  listBranches(params: {
    owner: string;
    repo: string;
    protected?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new branch
   */
  createBranch(params: {
    owner: string;
    repo: string;
    branch: string;
    from_branch?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get information about a user
   */
  getUser(params: {
    username: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List commits in a repository
   */
  listCommits(params: {
    owner: string;
    repo: string;
    sha?: string;
    path?: string;
    author?: string;
    since?: string;
    until?: string;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific commit
   */
  getCommit(params: {
    owner: string;
    repo: string;
    ref: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List comments on an issue
   */
  listIssueComments(params: {
    owner: string;
    repo: string;
    issue_number: number;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a comment to an issue
   */
  addIssueComment(params: {
    owner: string;
    repo: string;
    issue_number: number;
    body: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an issue comment
   */
  updateIssueComment(params: {
    owner: string;
    repo: string;
    comment_id: number;
    body: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an issue comment
   */
  deleteIssueComment(params: {
    owner: string;
    repo: string;
    comment_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List files changed in a pull request
   */
  listPRFiles(params: {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List commits on a pull request
   */
  listPRCommits(params: {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List reviews on a pull request
   */
  listPRReviews(params: {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a review on a pull request
   */
  createPRReview(params: {
    owner: string;
    repo: string;
    pull_number: number;
    body?: string;
    event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT";
    comments?: Array<{
      path: string;
      line: number;
      body: string;
    }>;
  }): Promise<MCPToolCallResponse>;

  /**
   * List review comments on a pull request
   */
  listPRReviewComments(params: {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the contents of a file or directory in a repository
   */
  getFileContents(params: {
    owner: string;
    repo: string;
    path: string;
    ref?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create or update a file in a repository
   */
  createOrUpdateFile(params: {
    owner: string;
    repo: string;
    path: string;
    message: string;
    content: string;
    sha?: string;
    branch?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a file from a repository
   */
  deleteFile(params: {
    owner: string;
    repo: string;
    path: string;
    message: string;
    sha: string;
    branch?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List releases in a repository
   */
  listReleases(params: {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific release
   */
  getRelease(params: {
    owner: string;
    repo: string;
    release_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the latest release for a repository
   */
  getLatestRelease(params: {
    owner: string;
    repo: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a release
   */
  createRelease(params: {
    owner: string;
    repo: string;
    tag_name: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    target_commitish?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List labels for a repository
   */
  listLabels(params: {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a label in a repository
   */
  createLabel(params: {
    owner: string;
    repo: string;
    name: string;
    color: string;
    description?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add labels to an issue
   */
  addIssueLabels(params: {
    owner: string;
    repo: string;
    issue_number: number;
    labels: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * List collaborators for a repository
   */
  listCollaborators(params: {
    owner: string;
    repo: string;
    affiliation?: "outside" | "direct" | "all";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Fork a repository
   */
  forkRepo(params: {
    owner: string;
    repo: string;
    organization?: string;
    name?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search repositories
   */
  searchRepos(params: {
    q: string;
    sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search issues and pull requests
   */
  searchIssues(params: {
    q: string;
    sort?: "comments" | "reactions" | "reactions-+1" | "reactions--1" | "reactions-smile" | "reactions-thinking_face" | "reactions-heart" | "reactions-tada" | "interactions" | "created" | "updated";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search code
   */
  searchCode(params: {
    q: string;
    sort?: "indexed";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List workflows in a repository
   */
  listWorkflows(params: {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List workflow runs for a repository or workflow
   */
  listWorkflowRuns(params: {
    owner: string;
    repo: string;
    workflow_id?: number | string;
    status?: "completed" | "action_required" | "cancelled" | "failure" | "neutral" | "skipped" | "stale" | "success" | "timed_out" | "in_progress" | "queued" | "requested" | "waiting" | "pending";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Trigger a workflow dispatch event
   */
  triggerWorkflow(params: {
    owner: string;
    repo: string;
    workflow_id: number | string;
    ref: string;
    inputs?: Record<string, string>;
  }): Promise<MCPToolCallResponse>;

  /**
   * List milestones for a repository
   */
  listMilestones(params: {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    sort?: "due_on" | "completeness";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a milestone
   */
  createMilestone(params: {
    owner: string;
    repo: string;
    title: string;
    state?: "open" | "closed";
    description?: string;
    due_on?: string;
  }): Promise<MCPToolCallResponse>;
}

