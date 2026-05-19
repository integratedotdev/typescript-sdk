import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FirebaseIntegrationClient {
  listProjects(params: {
    "pageSize"?: number;
    "pageToken"?: string;
  }): Promise<MCPToolCallResponse>;
  getProject(params: {
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  listWebApps(params: {
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  listAndroidApps(params: {
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  listIosApps(params: {
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  createWebApp(params: {
    "project_id": string;
    "app_json": string;
  }): Promise<MCPToolCallResponse>;
}
