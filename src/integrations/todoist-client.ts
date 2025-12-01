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
 * Todoist Integration Client Interface
 * Provides type-safe methods for all Todoist operations
 */
export interface TodoistIntegrationClient {
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
   * Get a specific project
   * 
   * @example
   * ```typescript
   * const project = await client.todoist.getProject({
   *   projectId: "2203306141"
   * });
   * ```
   */
  getProject(params: {
    /** Project ID */
    projectId: string;
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
    /** Parent project ID */
    parent_id?: string;
    /** Project color */
    color?: string;
    /** Whether project is a favorite */
    is_favorite?: boolean;
    /** View style */
    view_style?: "list" | "board";
  }): Promise<MCPToolCallResponse>;

  /**
   * List tasks
   * 
   * @example
   * ```typescript
   * const tasks = await client.todoist.listTasks({
   *   projectId: "2203306141"
   * });
   * ```
   */
  listTasks(params?: {
    /** Filter by project ID */
    projectId?: string;
    /** Filter by section ID */
    sectionId?: string;
    /** Filter by label */
    label?: string;
    /** Filter expression (Todoist filter syntax) */
    filter?: string;
    /** Language for filter parsing */
    lang?: string;
    /** List of task IDs to retrieve */
    ids?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific task
   * 
   * @example
   * ```typescript
   * const task = await client.todoist.getTask({
   *   taskId: "2995104339"
   * });
   * ```
   */
  getTask(params: {
    /** Task ID */
    taskId: string;
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
    /** Task content/title */
    content: string;
    /** Task description */
    description?: string;
    /** Project ID */
    project_id?: string;
    /** Section ID */
    section_id?: string;
    /** Parent task ID */
    parent_id?: string;
    /** Task order */
    order?: number;
    /** Labels to apply */
    labels?: string[];
    /** Priority (1-4, 4 is highest) */
    priority?: 1 | 2 | 3 | 4;
    /** Due date string (natural language) */
    due_string?: string;
    /** Due date (YYYY-MM-DD) */
    due_date?: string;
    /** Due datetime (RFC 3339) */
    due_datetime?: string;
    /** Due date language */
    due_lang?: string;
    /** Assignee ID */
    assignee_id?: string;
    /** Duration */
    duration?: number;
    /** Duration unit */
    duration_unit?: "minute" | "day";
  }): Promise<MCPToolCallResponse>;

  /**
   * Complete a task
   * 
   * @example
   * ```typescript
   * await client.todoist.completeTask({
   *   taskId: "2995104339"
   * });
   * ```
   */
  completeTask(params: {
    /** Task ID to complete */
    taskId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all labels
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
    /** Label order */
    order?: number;
    /** Whether label is a favorite */
    is_favorite?: boolean;
  }): Promise<MCPToolCallResponse>;
}

