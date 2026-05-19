import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MicrosoftToDoIntegrationClient {
  listTaskLists(params: {
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  getTaskList(params: {
    "list_id": string;
  }): Promise<MCPToolCallResponse>;
  createTaskList(params: {
    "list_json": string;
  }): Promise<MCPToolCallResponse>;
  listTasks(params: {
    "list_id": string;
    "$top"?: number;
    "$skip"?: number;
    "$filter"?: string;
  }): Promise<MCPToolCallResponse>;
  getTask(params: {
    "list_id": string;
    "task_id": string;
  }): Promise<MCPToolCallResponse>;
  createTask(params: {
    "list_id": string;
    "task_json": string;
  }): Promise<MCPToolCallResponse>;
  updateTask(params: {
    "list_id": string;
    "task_id": string;
    "task_json": string;
  }): Promise<MCPToolCallResponse>;
}
