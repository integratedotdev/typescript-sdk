/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface MicrosoftToDoListTaskListsParams {
    "$top"?: number;
    "$skip"?: number;
  }

export interface MicrosoftToDoGetTaskListParams {
    "list_id": string;
  }

export interface MicrosoftToDoCreateTaskListParams {
    "list_json": string;
  }

export interface MicrosoftToDoListTasksParams {
    "list_id": string;
    "$top"?: number;
    "$skip"?: number;
    "$filter"?: string;
  }

export interface MicrosoftToDoGetTaskParams {
    "list_id": string;
    "task_id": string;
  }

export interface MicrosoftToDoCreateTaskParams {
    "list_id": string;
    "task_json": string;
  }

export interface MicrosoftToDoUpdateTaskParams {
    "list_id": string;
    "task_id": string;
    "task_json": string;
  }

