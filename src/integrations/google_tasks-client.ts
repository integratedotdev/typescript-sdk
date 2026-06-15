import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleTasksIntegrationClient {
  clearCompleted(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createTasklist(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteTasklist(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getTasklist(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listTasklists(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listTasks(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  moveTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateTasklist(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
