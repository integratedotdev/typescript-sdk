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
 * Linear User
 */
export interface LinearUser {
  id: string;
  name: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  active: boolean;
  admin: boolean;
  guest?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Workflow State
 */
export interface LinearWorkflowState {
  id: string;
  name: string;
  color: string;
  type: "triage" | "backlog" | "unstarted" | "started" | "completed" | "canceled";
  position: number;
  description?: string;
  team: {
    id: string;
    name: string;
    key: string;
  };
}

/**
 * Linear Cycle
 */
export interface LinearCycle {
  id: string;
  name?: string;
  number: number;
  description?: string;
  startsAt: string;
  endsAt: string;
  progress: number;
  team: {
    id: string;
    name: string;
    key: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Issue Relation
 */
export interface LinearIssueRelation {
  id: string;
  type: "blocks" | "blocked_by" | "related" | "duplicate" | "duplicate_of";
  issue: {
    id: string;
    identifier: string;
    title: string;
  };
  relatedIssue: {
    id: string;
    identifier: string;
    title: string;
  };
}

/**
 * Linear Document
 */
export interface LinearDocument {
  id: string;
  title: string;
  content?: string;
  icon?: string;
  color?: string;
  creator: {
    id: string;
    name: string;
    email?: string;
  };
  project?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Initiative
 */
export interface LinearInitiative {
  id: string;
  name: string;
  description?: string;
  status?: string;
  creator: {
    id: string;
    name: string;
    email?: string;
  };
  projects?: Array<{
    id: string;
    name: string;
    state: string;
    progress?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Linear Attachment
 */
export interface LinearAttachment {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  issue: {
    id: string;
    identifier: string;
  };
  createdAt: string;
}

/**
 * Linear Integration Client Interface
 * Provides type-safe methods for all Linear operations
 */
export interface LinearIntegrationClient {
  // ── Issues ────────────────────────────────────────────────

  /**
   * Create a new issue in Linear
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
   */
  getIssue(params: {
    /** Issue ID or identifier (e.g., "ABC-123") */
    issueId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing issue
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
   * Archive an issue
   */
  archiveIssue(params: {
    /** Issue ID to archive */
    issueId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an issue permanently
   */
  deleteIssue(params: {
    /** Issue ID to delete */
    issueId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for issues
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

  /**
   * Add a comment to an issue
   */
  addComment(params: {
    /** Issue ID to comment on */
    issueId: string;
    /** Comment body (markdown supported) */
    body: string;
  }): Promise<MCPToolCallResponse>;

  // ── Users ─────────────────────────────────────────────────

  /**
   * List users in the workspace
   */
  listUsers(params?: {
    /** Number of users to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
    /** Include disabled/deactivated users */
    includeDisabled?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific user by ID
   */
  getUser(params: {
    /** User ID */
    userId: string;
  }): Promise<MCPToolCallResponse>;

  // ── Teams ─────────────────────────────────────────────────

  /**
   * List teams in Linear
   */
  listTeams(params?: {
    /** Number of teams to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Workflow States ───────────────────────────────────────

  /**
   * List workflow states
   */
  listWorkflowStates(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of states to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new workflow state
   */
  createWorkflowState(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Projects ──────────────────────────────────────────────

  /**
   * List projects in Linear
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
   * Get a specific project by ID
   */
  getProject(params: {
    /** Project ID */
    projectId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new project
   */
  createProject(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing project
   */
  updateProject(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Cycles ────────────────────────────────────────────────

  /**
   * List cycles (sprints)
   */
  listCycles(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of cycles to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific cycle by ID
   */
  getCycle(params: {
    /** Cycle ID */
    cycleId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new cycle (sprint)
   */
  createCycle(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing cycle
   */
  updateCycle(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Labels ────────────────────────────────────────────────

  /**
   * List labels in Linear
   */
  listLabels(params?: {
    /** Team ID to filter by */
    teamId?: string;
    /** Number of labels to return */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Issue Relations ───────────────────────────────────────

  /**
   * Create a relation between two issues
   */
  createIssueRelation(params: {
    /** Source issue ID */
    issueId: string;
    /** Related issue ID */
    relatedIssueId: string;
    /** Relation type */
    type: "blocks" | "blocked_by" | "related" | "duplicate" | "duplicate_of";
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an issue relation
   */
  deleteIssueRelation(params: {
    /** Issue relation ID to delete */
    relationId: string;
  }): Promise<MCPToolCallResponse>;

  // ── Documents ─────────────────────────────────────────────

  /**
   * List documents
   */
  listDocuments(params?: {
    /** Filter by project ID */
    projectId?: string;
    /** Number of documents to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific document by ID
   */
  getDocument(params: {
    /** Document ID */
    documentId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new document
   */
  createDocument(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing document
   */
  updateDocument(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Initiatives ───────────────────────────────────────────

  /**
   * List initiatives
   */
  listInitiatives(params?: {
    /** Number of initiatives to return (max 50) */
    first?: number;
    /** Pagination cursor */
    after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific initiative by ID
   */
  getInitiative(params: {
    /** Initiative ID */
    initiativeId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new initiative
   */
  createInitiative(params: {
    /** Initiative name */
    name: string;
    /** Initiative description */
    description?: string;
    /** Initiative status */
    status?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Attachments ───────────────────────────────────────────

  /**
   * Create an attachment (link) on an issue
   */
  createAttachment(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Project Updates ───────────────────────────────────────

  /**
   * Create a status update for a project
   */
  createProjectUpdate(params: {
    /** Project ID */
    projectId: string;
    /** Update body (markdown) */
    body: string;
    /** Project health status */
    health?: "onTrack" | "atRisk" | "offTrack";
  }): Promise<MCPToolCallResponse>;
}
