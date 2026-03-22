/**
 * Todoist Integration Client Types
 * Fully typed interface for Todoist integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Todoist Project
 */
export interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: "list" | "board";
  url: string;
}

/**
 * Todoist Task
 */
export interface TodoistTask {
  id: string;
  project_id: string;
  section_id?: string;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  parent_id?: string;
  order: number;
  priority: 1 | 2 | 3 | 4;
  due?: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
    datetime?: string;
    timezone?: string;
  };
  url: string;
  comment_count: number;
  created_at: string;
  creator_id: string;
  assignee_id?: string;
  assigner_id?: string;
  duration?: {
    amount: number;
    unit: "minute" | "day";
  };
}

/**
 * Todoist Label
 */
export interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

/**
 * Todoist Section
 */
export interface TodoistSection {
  id: string;
  project_id: string;
  order: number;
  name: string;
}

/**
 * Todoist Comment
 */
export interface TodoistComment {
  id: string;
  task_id?: string;
  project_id?: string;
  content: string;
  posted_at: string;
}

/**
 * Todoist Reminder
 */
export interface TodoistReminder {
  id: string;
  task_id: string;
  due?: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
    datetime?: string;
    timezone?: string;
  };
}

/**
 * Todoist Integration Client Interface
 * Provides type-safe methods for all Todoist operations
 */
export interface TodoistIntegrationClient {
  // ── Projects ───────────────────────────────────────────────

  /**
   * List all projects
   *
   * @example
   * ```typescript
   * const projects = await client.todoist.listProjects({});
   * ```
   */
  listProjects(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * Get details of a specific project
   *
   * @example
   * ```typescript
   * const project = await client.todoist.getProject({
   *   project_id: "2203306141"
   * });
   * ```
   */
  getProject(params: {
    /** Project ID */
    project_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new project
   *
   * @example
   * ```typescript
   * const project = await client.todoist.createProject({
   *   name: "My New Project",
   *   color: "blue"
   * });
   * ```
   */
  createProject(params: {
    /** Project name */
    name: string;
    /** Color (e.g., berry_red, blue, green) */
    color?: string;
    /** Parent project ID for sub-projects */
    parent_id?: string;
    /** Mark as favorite */
    is_favorite?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing project
   *
   * @example
   * ```typescript
   * const project = await client.todoist.updateProject({
   *   project_id: "2203306141",
   *   name: "Renamed Project"
   * });
   * ```
   */
  updateProject(params: {
    /** Project ID */
    project_id: string;
    /** New project name */
    name?: string;
    /** New color */
    color?: string;
    /** Mark as favorite */
    is_favorite?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a project
   *
   * @example
   * ```typescript
   * await client.todoist.deleteProject({
   *   project_id: "2203306141"
   * });
   * ```
   */
  deleteProject(params: {
    /** Project ID */
    project_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Archive a project
   *
   * @example
   * ```typescript
   * await client.todoist.archiveProject({
   *   project_id: "2203306141"
   * });
   * ```
   */
  archiveProject(params: {
    /** Project ID */
    project_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Tasks ──────────────────────────────────────────────────

  /**
   * List active tasks with optional filters
   *
   * @example
   * ```typescript
   * const tasks = await client.todoist.listTasks({
   *   project_id: "2203306141"
   * });
   * ```
   */
  listTasks(params?: {
    /** Filter by project ID */
    project_id?: string;
    /** Filter by section ID */
    section_id?: string;
    /** Filter by label name */
    label?: string;
    /** Todoist filter string (e.g., today, p1, overdue) */
    filter?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get details of a specific task
   *
   * @example
   * ```typescript
   * const task = await client.todoist.getTask({
   *   task_id: "2995104339"
   * });
   * ```
   */
  getTask(params: {
    /** Task ID */
    task_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new task
   *
   * @example
   * ```typescript
   * const task = await client.todoist.createTask({
   *   content: "Buy groceries",
   *   due_string: "tomorrow at 10am",
   *   priority: 2
   * });
   * ```
   */
  createTask(params: {
    /** Task title/content */
    content: string;
    /** Task description */
    description?: string;
    /** Project to add task to */
    project_id?: string;
    /** Section within project */
    section_id?: string;
    /** Parent task ID (to create a subtask) */
    parent_id?: string;
    /** Priority: 1 (normal) to 4 (urgent) */
    priority?: number;
    /** Natural language due date (e.g., tomorrow, next monday) */
    due_string?: string;
    /** Due date in YYYY-MM-DD format */
    due_date?: string;
    /** Comma-separated label names */
    labels?: string;
    /** User ID to assign task to (shared projects) */
    assignee_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing task
   *
   * @example
   * ```typescript
   * const task = await client.todoist.updateTask({
   *   task_id: "2995104339",
   *   content: "Updated task title",
   *   priority: 3
   * });
   * ```
   */
  updateTask(params: {
    /** Task ID */
    task_id: string;
    /** New title/content */
    content?: string;
    /** New description */
    description?: string;
    /** Priority: 1–4 */
    priority?: number;
    /** Natural language due date */
    due_string?: string;
    /** Due date in YYYY-MM-DD format */
    due_date?: string;
    /** Comma-separated label names (replaces existing) */
    labels?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Mark a task as complete
   *
   * @example
   * ```typescript
   * await client.todoist.completeTask({
   *   task_id: "2995104339"
   * });
   * ```
   */
  completeTask(params: {
    /** Task ID */
    task_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a task permanently
   *
   * @example
   * ```typescript
   * await client.todoist.deleteTask({
   *   task_id: "2995104339"
   * });
   * ```
   */
  deleteTask(params: {
    /** Task ID */
    task_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reopen a completed task
   *
   * @example
   * ```typescript
   * await client.todoist.reopenTask({
   *   task_id: "2995104339"
   * });
   * ```
   */
  reopenTask(params: {
    /** Task ID */
    task_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Move a task to a different project, section, or parent
   *
   * @example
   * ```typescript
   * const task = await client.todoist.moveTask({
   *   task_id: "2995104339",
   *   project_id: "2203306142"
   * });
   * ```
   */
  moveTask(params: {
    /** Task ID */
    task_id: string;
    /** Target project ID */
    project_id?: string;
    /** Target section ID */
    section_id?: string;
    /** Target parent task ID (to nest as subtask) */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a task using natural language
   *
   * @example
   * ```typescript
   * const task = await client.todoist.quickAddTask({
   *   text: "Buy milk tomorrow p1 #Shopping @errands"
   * });
   * ```
   */
  quickAddTask(params: {
    /** Full task string with natural language parsing */
    text: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get completed tasks
   *
   * @example
   * ```typescript
   * const tasks = await client.todoist.getCompletedTasks({
   *   project_id: "2203306141",
   *   limit: 50
   * });
   * ```
   */
  getCompletedTasks(params?: {
    /** Filter by project ID */
    project_id?: string;
    /** Return tasks completed after this date (RFC3339 or YYYY-MM-DD) */
    since?: string;
    /** Return tasks completed before this date */
    until?: string;
    /** Max tasks to return */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get tasks matching a Todoist filter expression
   *
   * @example
   * ```typescript
   * const tasks = await client.todoist.filterTasks({
   *   query: "p1 & overdue"
   * });
   * ```
   */
  filterTasks(params: {
    /** Filter query (e.g., today, p1 & overdue, #Work & @waiting) */
    query: string;
  }): Promise<MCPToolCallResponse>;

  // ── Sections ───────────────────────────────────────────────

  /**
   * List sections, optionally filtered by project
   *
   * @example
   * ```typescript
   * const sections = await client.todoist.listSections({
   *   project_id: "2203306141"
   * });
   * ```
   */
  listSections(params?: {
    /** Filter by project ID */
    project_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new section in a project
   *
   * @example
   * ```typescript
   * const section = await client.todoist.createSection({
   *   name: "In Progress",
   *   project_id: "2203306141"
   * });
   * ```
   */
  createSection(params: {
    /** Section name */
    name: string;
    /** Project to add section to */
    project_id: string;
    /** Position order within the project */
    order?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get details of a specific section
   *
   * @example
   * ```typescript
   * const section = await client.todoist.getSection({
   *   section_id: "7025"
   * });
   * ```
   */
  getSection(params: {
    /** Section ID */
    section_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Rename a section
   *
   * @example
   * ```typescript
   * const section = await client.todoist.updateSection({
   *   section_id: "7025",
   *   name: "Done"
   * });
   * ```
   */
  updateSection(params: {
    /** Section ID */
    section_id: string;
    /** New section name */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a section (and all tasks in it)
   *
   * @example
   * ```typescript
   * await client.todoist.deleteSection({
   *   section_id: "7025"
   * });
   * ```
   */
  deleteSection(params: {
    /** Section ID */
    section_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Comments ───────────────────────────────────────────────

  /**
   * List comments on a task or project
   *
   * @example
   * ```typescript
   * const comments = await client.todoist.listComments({
   *   task_id: "2995104339"
   * });
   * ```
   */
  listComments(params: {
    /** Task ID (provide either task_id or project_id) */
    task_id?: string;
    /** Project ID */
    project_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a comment to a task or project
   *
   * @example
   * ```typescript
   * const comment = await client.todoist.createComment({
   *   content: "This is a comment",
   *   task_id: "2995104339"
   * });
   * ```
   */
  createComment(params: {
    /** Comment text (supports Markdown) */
    content: string;
    /** Task ID (provide either task_id or project_id) */
    task_id?: string;
    /** Project ID */
    project_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get details of a specific comment
   *
   * @example
   * ```typescript
   * const comment = await client.todoist.getComment({
   *   comment_id: "2992679862"
   * });
   * ```
   */
  getComment(params: {
    /** Comment ID */
    comment_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a comment's text
   *
   * @example
   * ```typescript
   * const comment = await client.todoist.updateComment({
   *   comment_id: "2992679862",
   *   content: "Updated comment"
   * });
   * ```
   */
  updateComment(params: {
    /** Comment ID */
    comment_id: string;
    /** New comment text */
    content: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a comment
   *
   * @example
   * ```typescript
   * await client.todoist.deleteComment({
   *   comment_id: "2992679862"
   * });
   * ```
   */
  deleteComment(params: {
    /** Comment ID */
    comment_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Labels ─────────────────────────────────────────────────

  /**
   * List all personal labels
   *
   * @example
   * ```typescript
   * const labels = await client.todoist.listLabels({});
   * ```
   */
  listLabels(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * Create a new label
   *
   * @example
   * ```typescript
   * const label = await client.todoist.createLabel({
   *   name: "urgent",
   *   color: "red"
   * });
   * ```
   */
  createLabel(params: {
    /** Label name */
    name: string;
    /** Label color */
    color?: string;
    /** Display order */
    order?: number;
    /** Mark as favorite */
    is_favorite?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a label
   *
   * @example
   * ```typescript
   * const label = await client.todoist.updateLabel({
   *   label_id: "2156154810",
   *   name: "critical"
   * });
   * ```
   */
  updateLabel(params: {
    /** Label ID */
    label_id: string;
    /** New name */
    name?: string;
    /** New color */
    color?: string;
    /** New display order */
    order?: number;
    /** Mark as favorite */
    is_favorite?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a label
   *
   * @example
   * ```typescript
   * await client.todoist.deleteLabel({
   *   label_id: "2156154810"
   * });
   * ```
   */
  deleteLabel(params: {
    /** Label ID */
    label_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Reminders ──────────────────────────────────────────────

  /**
   * List all reminders
   *
   * @example
   * ```typescript
   * const reminders = await client.todoist.listReminders({});
   * ```
   */
  listReminders(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * Create a reminder for a task
   *
   * @example
   * ```typescript
   * const reminder = await client.todoist.createReminder({
   *   task_id: "2995104339",
   *   due_string: "tomorrow at 9am"
   * });
   * ```
   */
  createReminder(params: {
    /** Task ID */
    task_id: string;
    /** Natural language due time (e.g., tomorrow at 9am) */
    due_string?: string;
    /** Due date in YYYY-MM-DD format */
    due_date?: string;
    /** Due datetime in RFC3339 format */
    due_datetime?: string;
  }): Promise<MCPToolCallResponse>;
}
