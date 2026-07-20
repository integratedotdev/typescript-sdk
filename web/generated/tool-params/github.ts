/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GithubCreateIssueParams {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
  }

export interface GithubListIssuesParams {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    labels?: string[];
    sort?: "created" | "updated" | "comments";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubGetIssueParams {
    owner: string;
    repo: string;
    issue_number: number;
  }

export interface GithubUpdateIssueParams {
    owner: string;
    repo: string;
    issue_number: number;
    title?: string;
    body?: string;
    state?: "open" | "closed";
    labels?: string[];
    assignees?: string[];
  }

export interface GithubCloseIssueParams {
    owner: string;
    repo: string;
    issue_number: number;
  }

export interface GithubCreatePullRequestParams {
    owner: string;
    repo: string;
    title: string;
    head: string;
    base: string;
    body?: string;
    draft?: boolean;
  }

export interface GithubListPullRequestsParams {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    sort?: "created" | "updated" | "popularity" | "long-running";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubGetPullRequestParams {
    owner: string;
    repo: string;
    pull_number: number;
  }

export interface GithubMergePullRequestParams {
    owner: string;
    repo: string;
    pull_number: number;
    commit_title?: string;
    commit_message?: string;
    merge_method?: "merge" | "squash" | "rebase";
  }

export interface GithubListReposParams {
    owner: string;
    type?: "all" | "owner" | "member";
    sort?: "created" | "updated" | "pushed" | "full_name";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubListOwnReposParams {
    visibility?: "all" | "public" | "private";
    affiliation?: string;
    type?: "all" | "owner" | "public" | "private" | "member";
    sort?: "created" | "updated" | "pushed" | "full_name";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubGetRepoParams {
    owner: string;
    repo: string;
  }

export interface GithubCreateRepoParams {
    name: string;
    description?: string;
    private?: boolean;
    auto_init?: boolean;
    gitignore_template?: string;
    license_template?: string;
  }

export interface GithubListBranchesParams {
    owner: string;
    repo: string;
    protected?: boolean;
    per_page?: number;
    page?: number;
  }

export interface GithubCreateBranchParams {
    owner: string;
    repo: string;
    branch: string;
    from_branch?: string;
  }

export interface GithubGetUserParams {
    username: string;
  }

export interface GithubListCommitsParams {
    owner: string;
    repo: string;
    sha?: string;
    path?: string;
    author?: string;
    since?: string;
    until?: string;
    per_page?: number;
    page?: number;
  }

export interface GithubGetCommitParams {
    owner: string;
    repo: string;
    ref: string;
  }

export interface GithubListIssueCommentsParams {
    owner: string;
    repo: string;
    issue_number: number;
    per_page?: number;
    page?: number;
  }

export interface GithubAddIssueCommentParams {
    owner: string;
    repo: string;
    issue_number: number;
    body: string;
  }

export interface GithubUpdateIssueCommentParams {
    owner: string;
    repo: string;
    comment_id: number;
    body: string;
  }

export interface GithubDeleteIssueCommentParams {
    owner: string;
    repo: string;
    comment_id: number;
  }

export interface GithubListPRFilesParams {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }

export interface GithubListPRCommitsParams {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }

export interface GithubListPRReviewsParams {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }

export interface GithubCreatePRReviewParams {
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
  }

export interface GithubListPRReviewCommentsParams {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }

export interface GithubGetFileContentsParams {
    owner: string;
    repo: string;
    path: string;
    ref?: string;
  }

export interface GithubCreateOrUpdateFileParams {
    owner: string;
    repo: string;
    path: string;
    message: string;
    content: string;
    sha?: string;
    branch?: string;
  }

export interface GithubDeleteFileParams {
    owner: string;
    repo: string;
    path: string;
    message: string;
    sha: string;
    branch?: string;
  }

export interface GithubListReleasesParams {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }

export interface GithubGetReleaseParams {
    owner: string;
    repo: string;
    release_id: number;
  }

export interface GithubGetLatestReleaseParams {
    owner: string;
    repo: string;
  }

export interface GithubCreateReleaseParams {
    owner: string;
    repo: string;
    tag_name: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    target_commitish?: string;
  }

export interface GithubListLabelsParams {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }

export interface GithubCreateLabelParams {
    owner: string;
    repo: string;
    name: string;
    color: string;
    description?: string;
  }

export interface GithubAddIssueLabelsParams {
    owner: string;
    repo: string;
    issue_number: number;
    labels: string[];
  }

export interface GithubListCollaboratorsParams {
    owner: string;
    repo: string;
    affiliation?: "outside" | "direct" | "all";
    per_page?: number;
    page?: number;
  }

export interface GithubForkRepoParams {
    owner: string;
    repo: string;
    organization?: string;
    name?: string;
  }

export interface GithubSearchReposParams {
    q: string;
    sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubSearchIssuesParams {
    q: string;
    sort?: "comments" | "reactions" | "reactions-+1" | "reactions--1" | "reactions-smile" | "reactions-thinking_face" | "reactions-heart" | "reactions-tada" | "interactions" | "created" | "updated";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubSearchCodeParams {
    q: string;
    sort?: "indexed";
    order?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubListWorkflowsParams {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }

export interface GithubListWorkflowRunsParams {
    owner: string;
    repo: string;
    workflow_id?: number | string;
    status?: "completed" | "action_required" | "cancelled" | "failure" | "neutral" | "skipped" | "stale" | "success" | "timed_out" | "in_progress" | "queued" | "requested" | "waiting" | "pending";
    per_page?: number;
    page?: number;
  }

export interface GithubTriggerWorkflowParams {
    owner: string;
    repo: string;
    workflow_id: number | string;
    ref: string;
    inputs?: Record<string, string>;
  }

export interface GithubListMilestonesParams {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    sort?: "due_on" | "completeness";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }

export interface GithubCreateMilestoneParams {
    owner: string;
    repo: string;
    title: string;
    state?: "open" | "closed";
    description?: string;
    due_on?: string;
  }

