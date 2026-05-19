import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoSprintsIntegrationClient {
  listPortals(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listProjects(params: {
    "portal_id": string;
  }): Promise<MCPToolCallResponse>;
  listSprints(params: {
    "portal_id": string;
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  listWorkItems(params: {
    "portal_id": string;
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
  createWorkItem(params: {
    "portal_id": string;
    "project_id": string;
    "work_item_json": string;
  }): Promise<MCPToolCallResponse>;
  listEpics(params: {
    "portal_id": string;
    "project_id": string;
  }): Promise<MCPToolCallResponse>;
}
