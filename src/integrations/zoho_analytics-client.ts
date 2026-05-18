import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoAnalyticsIntegrationClient {
  listWorkspaces(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getWorkspace(params: { workspace_id: string }): Promise<MCPToolCallResponse>;
  listViews(params: { workspace_id: string }): Promise<MCPToolCallResponse>;
  exportView(params: { workspace_id: string; view_id: string; responseFormat?: string }): Promise<MCPToolCallResponse>;
  importData(params: { workspace_id: string; view_id: string; data_json: string }): Promise<MCPToolCallResponse>;
  query(params: { workspace_id: string; query_json: string }): Promise<MCPToolCallResponse>;
}
