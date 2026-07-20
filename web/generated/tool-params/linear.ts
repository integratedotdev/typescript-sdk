/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface LinearCreateIssueParams {
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
  }

export interface LinearListIssuesParams {
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
  }

export interface LinearGetIssueParams {
    /** Issue ID or identifier (e.g., "ABC-123") */
    issueId: string;
  }

export interface LinearUpdateIssueParams {
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
  }

export interface LinearArchiveIssueParams {
    /** Issue ID to archive */
    issueId: string;
  }

export interface LinearDeleteIssueParams {
    /** Issue ID to delete */
    issueId: string;
  }

export interface LinearSearchIssuesParams {
    /** Search query */
    query: string;
    /** Team ID to filter by */
    teamId?: string;
    /** Include archived issues */
    includeArchived?: boolean;
    /** Number of results to return */
    first?: number;
  }

export interface LinearAddCommentParams {
    /** Issue ID to comment on */
    issueId: string;
    /** Comment body (markdown supported) */
    body: string;
  }

export interface LinearListUsersParams {
    /** Number of users to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
    /** Include disabled/deactivated users */
    includeDisabled?: boolean;
  }

export interface LinearGetUserParams {
    /** User ID */
    userId: string;
  }

export interface LinearListTeamsParams {
    /** Number of teams to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearListWorkflowStatesParams {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of states to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearCreateWorkflowStateParams {
    /** Team ID to create the state in */
    teamId: string;
    /** State name */
    name: string;
    /** State color (hex, e.g. "#ff0000") */
    color: string;
    /** State type */
    type: "triage" | "backlog" | "unstarted" | "started" | "completed" | "canceled";
    /** State description */
    description?: string;
    /** State position (float) */
    position?: number;
  }

export interface LinearListProjectsParams {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of projects to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
    /** Include archived projects */
    includeArchived?: boolean;
  }

export interface LinearGetProjectParams {
    /** Project ID */
    projectId: string;
  }

export interface LinearCreateProjectParams {
    /** Project name */
    name: string;
    /** Team IDs to associate with the project */
    teamIds: string[];
    /** Project description */
    description?: string;
    /** Project state */
    state?: "planned" | "started" | "paused" | "completed" | "canceled";
    /** Lead user ID */
    leadId?: string;
    /** Start date (YYYY-MM-DD) */
    startDate?: string;
    /** Target date (YYYY-MM-DD) */
    targetDate?: string;
  }

export interface LinearUpdateProjectParams {
    /** Project ID to update */
    projectId: string;
    /** New project name */
    name?: string;
    /** New project description */
    description?: string;
    /** New project state */
    state?: "planned" | "started" | "paused" | "completed" | "canceled";
    /** New lead user ID */
    leadId?: string;
    /** New start date (YYYY-MM-DD) */
    startDate?: string;
    /** New target date (YYYY-MM-DD) */
    targetDate?: string;
  }

export interface LinearListCyclesParams {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of cycles to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearGetCycleParams {
    /** Cycle ID */
    cycleId: string;
  }

export interface LinearCreateCycleParams {
    /** Team ID to create the cycle in */
    teamId: string;
    /** Cycle start date (ISO 8601) */
    startsAt: string;
    /** Cycle end date (ISO 8601) */
    endsAt: string;
    /** Cycle name */
    name?: string;
    /** Cycle description */
    description?: string;
  }

export interface LinearUpdateCycleParams {
    /** Cycle ID to update */
    cycleId: string;
    /** New cycle name */
    name?: string;
    /** New cycle description */
    description?: string;
    /** New start date (ISO 8601) */
    startsAt?: string;
    /** New end date (ISO 8601) */
    endsAt?: string;
  }

export interface LinearListLabelsParams {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of labels to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearCreateIssueRelationParams {
    /** Source issue ID */
    issueId: string;
    /** Related issue ID */
    relatedIssueId: string;
    /** Relation type */
    type: "blocks" | "blocked_by" | "related" | "duplicate" | "duplicate_of";
  }

export interface LinearDeleteIssueRelationParams {
    /** Issue relation ID to delete */
    relationId: string;
  }

export interface LinearListDocumentsParams {
    /** Filter by project ID */
    projectId?: string;
    /** Number of documents to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearGetDocumentParams {
    /** Document ID */
    documentId: string;
  }

export interface LinearCreateDocumentParams {
    /** Document title */
    title: string;
    /** Document content (markdown) */
    content: string;
    /** Project ID to associate with */
    projectId?: string;
    /** Document icon emoji */
    icon?: string;
    /** Document color (hex) */
    color?: string;
  }

export interface LinearUpdateDocumentParams {
    /** Document ID to update */
    documentId: string;
    /** New title */
    title?: string;
    /** New content (markdown) */
    content?: string;
    /** New icon emoji */
    icon?: string;
    /** New color (hex) */
    color?: string;
    /** New project ID */
    projectId?: string;
  }

export interface LinearListInitiativesParams {
    /** Number of initiatives to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }

export interface LinearGetInitiativeParams {
    /** Initiative ID */
    initiativeId: string;
  }

export interface LinearCreateInitiativeParams {
    /** Initiative name */
    name: string;
    /** Initiative description */
    description?: string;
    /** Initiative status */
    status?: string;
  }

export interface LinearCreateAttachmentParams {
    /** Issue ID to attach to */
    issueId: string;
    /** Attachment URL */
    url: string;
    /** Attachment title */
    title?: string;
    /** Attachment subtitle */
    subtitle?: string;
    /** Icon URL for the attachment */
    iconUrl?: string;
  }

export interface LinearCreateProjectUpdateParams {
    /** Project ID */
    projectId: string;
    /** Update body (markdown) */
    body: string;
    /** Project health status */
    health?: "onTrack" | "atRisk" | "offTrack";
  }

