import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoWorkdriveIntegrationClient {
  listTeams(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listTeamFolders(params: {
    "page[limit]"?: number;
    "page[offset]"?: number;
  }): Promise<MCPToolCallResponse>;
  getTeamFolder(params: {
    "folder_id": string;
  }): Promise<MCPToolCallResponse>;
  listFiles(params: {
    "parent_id"?: string;
    "page[limit]"?: number;
    "page[offset]"?: number;
  }): Promise<MCPToolCallResponse>;
  getFile(params: {
    "file_id": string;
  }): Promise<MCPToolCallResponse>;
  createFolder(params: {
    "folder_json": string;
  }): Promise<MCPToolCallResponse>;
}
