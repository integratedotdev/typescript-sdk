import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AsanaIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkspaces(params?: { limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  listProjects(params?: { workspace?: string; team?: string; archived?: boolean; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  getProject(params: { project_gid: string }): Promise<MCPToolCallResponse>;
  createProject(params: { project_json: string }): Promise<MCPToolCallResponse>;
  updateProject(params: { project_gid: string; project_json: string }): Promise<MCPToolCallResponse>;
  listSections(params: { project_gid: string; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  listTasks(params?: { workspace?: string; project?: string; section?: string; assignee?: string; completed_since?: string; modified_since?: string; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  getTask(params: { task_gid: string }): Promise<MCPToolCallResponse>;
  createTask(params: { task_json: string }): Promise<MCPToolCallResponse>;
  updateTask(params: { task_gid: string; task_json: string }): Promise<MCPToolCallResponse>;
  deleteTask(params: { task_gid: string }): Promise<MCPToolCallResponse>;
  listStories(params: { task_gid: string; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  createStory(params: { task_gid: string; story_json: string }): Promise<MCPToolCallResponse>;
  listUsers(params?: { workspace?: string; team?: string; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
  listTeams(params: { workspace_gid: string; limit?: number; offset?: string }): Promise<MCPToolCallResponse>;
}

