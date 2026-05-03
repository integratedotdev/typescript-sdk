import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SharePointIntegrationClient {
  createFolder(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteItem(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getItem(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getSite(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listDrives(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listItems(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  searchFiles(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  searchSites(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  shareItem(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateItem(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  uploadFile(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
