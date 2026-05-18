import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoProjectsIntegrationClient {
  listPortals(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listProjects(params: { portal_id: string }): Promise<MCPToolCallResponse>;
  getProject(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
  listMilestones(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
  listTasklists(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
  listTasks(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
  createTask(params: { portal_id: string; project_id: string; task_json: string }): Promise<MCPToolCallResponse>;
  listIssues(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
  listTimesheets(params: { portal_id: string; project_id: string }): Promise<MCPToolCallResponse>;
}
