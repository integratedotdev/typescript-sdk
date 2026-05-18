import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BigqueryIntegrationClient {
  listProjects(params: { "maxResults"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
  listDatasets(params: { project_id: string; "maxResults"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
  listTables(params: { project_id: string; dataset_id: string; "maxResults"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
  getTable(params: { project_id: string; dataset_id: string; table_id: string }): Promise<MCPToolCallResponse>;
  query(params: { project_id: string; query_json: string }): Promise<MCPToolCallResponse>;
  listJobs(params: { project_id: string; "maxResults"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
}
