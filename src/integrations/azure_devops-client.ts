import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AzureDevopsIntegrationClient {
  listProjects(params: {
    "organization": string;
  }): Promise<MCPToolCallResponse>;
  listRepositories(params: {
    "organization": string;
    "project": string;
  }): Promise<MCPToolCallResponse>;
  listPullRequests(params: {
    "organization": string;
    "project": string;
    "repository_id": string;
    "searchCriteria.status"?: string;
  }): Promise<MCPToolCallResponse>;
  listBuilds(params: {
    "organization": string;
    "project": string;
  }): Promise<MCPToolCallResponse>;
  queueBuild(params: {
    "organization": string;
    "project": string;
    "build_json": string;
  }): Promise<MCPToolCallResponse>;
  getWorkItem(params: {
    "organization": string;
    "work_item_id": string;
  }): Promise<MCPToolCallResponse>;
}
