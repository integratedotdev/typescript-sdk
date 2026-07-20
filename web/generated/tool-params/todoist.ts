/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface TodoistGetProjectParams {
    /** Project ID */
    project_id: string;
  }

export interface TodoistCreateProjectParams {
    /** Project name */
    name: string;
    /** Color (e.g., berry_red, blue, green) */
    color?: string;
    /** Parent project ID for sub-projects */
    parent_id?: string;
    /** Mark as favorite */
    is_favorite?: boolean;
  }

export interface TodoistUpdateProjectParams {
    /** Project ID */
    project_id: string;
    /** New project name */
    name?: string;
    /** New color */
    color?: string;
    /** Mark as favorite */
    is_favorite?: boolean;
  }

export interface TodoistDeleteProjectParams {
    /** Project ID */
    project_id: string;
  }

export interface TodoistArchiveProjectParams {
    /** Project ID */
    project_id: string;
  }

export interface TodoistListTasksParams {
    /** Filter by project ID */
    project_id?: string;
    /** Filter by section ID */
    section_id?: string;
    /** Filter by label name */
    label?: string;
    /** Todoist filter string (e.g., today, p1, overdue) */
    filter?: string;
  }

export interface TodoistGetTaskParams {
    /** Task ID */
    task_id: string;
  }

export interface TodoistCreateTaskParams {
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
  }

export interface TodoistUpdateTaskParams {
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
  }

export interface TodoistCompleteTaskParams {
    /** Task ID */
    task_id: string;
  }

export interface TodoistDeleteTaskParams {
    /** Task ID */
    task_id: string;
  }

export interface TodoistReopenTaskParams {
    /** Task ID */
    task_id: string;
  }

export interface TodoistMoveTaskParams {
    /** Task ID */
    task_id: string;
    /** Target project ID */
    project_id?: string;
    /** Target section ID */
    section_id?: string;
    /** Target parent task ID (to nest as subtask) */
    parent_id?: string;
  }

export interface TodoistQuickAddTaskParams {
    /** Full task string with natural language parsing */
    text: string;
  }

export interface TodoistGetCompletedTasksParams {
    /** Filter by project ID */
    project_id?: string;
    /** Return tasks completed after this date (RFC3339 or YYYY-MM-DD) */
    since?: string;
    /** Return tasks completed before this date */
    until?: string;
    /** Max tasks to return */
    limit?: number;
  }

export interface TodoistFilterTasksParams {
    /** Filter query (e.g., today, p1 & overdue, #Work & @waiting) */
    query: string;
  }

export interface TodoistListSectionsParams {
    /** Filter by project ID */
    project_id?: string;
  }

export interface TodoistCreateSectionParams {
    /** Section name */
    name: string;
    /** Project to add section to */
    project_id: string;
    /** Position order within the project */
    order?: number;
  }

export interface TodoistGetSectionParams {
    /** Section ID */
    section_id: string;
  }

export interface TodoistUpdateSectionParams {
    /** Section ID */
    section_id: string;
    /** New section name */
    name: string;
  }

export interface TodoistDeleteSectionParams {
    /** Section ID */
    section_id: string;
  }

export interface TodoistListCommentsParams {
    /** Task ID (provide either task_id or project_id) */
    task_id?: string;
    /** Project ID */
    project_id?: string;
  }

export interface TodoistCreateCommentParams {
    /** Comment text (supports Markdown) */
    content: string;
    /** Task ID (provide either task_id or project_id) */
    task_id?: string;
    /** Project ID */
    project_id?: string;
  }

export interface TodoistGetCommentParams {
    /** Comment ID */
    comment_id: string;
  }

export interface TodoistUpdateCommentParams {
    /** Comment ID */
    comment_id: string;
    /** New comment text */
    content: string;
  }

export interface TodoistDeleteCommentParams {
    /** Comment ID */
    comment_id: string;
  }

export interface TodoistCreateLabelParams {
    /** Label name */
    name: string;
    /** Label color */
    color?: string;
    /** Display order */
    order?: number;
    /** Mark as favorite */
    is_favorite?: boolean;
  }

export interface TodoistUpdateLabelParams {
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
  }

export interface TodoistDeleteLabelParams {
    /** Label ID */
    label_id: string;
  }

export interface TodoistCreateReminderParams {
    /** Task ID */
    task_id: string;
    /** Natural language due time (e.g., tomorrow at 9am) */
    due_string?: string;
    /** Due date in YYYY-MM-DD format */
    due_date?: string;
    /** Due datetime in RFC3339 format */
    due_datetime?: string;
  }

