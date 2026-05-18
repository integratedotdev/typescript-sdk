import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface LookerIntegrationClient {
  me(params: { looker_base_url: string }): Promise<MCPToolCallResponse>;
  searchDashboards(params: { "title"?: string; "limit"?: number; "offset"?: number; looker_base_url: string }): Promise<MCPToolCallResponse>;
  getDashboard(params: { dashboard_id: string; looker_base_url: string }): Promise<MCPToolCallResponse>;
  runQuery(params: { query_json: string; looker_base_url: string }): Promise<MCPToolCallResponse>;
  listLooks(params: { "limit"?: number; "offset"?: number; looker_base_url: string }): Promise<MCPToolCallResponse>;
  getLook(params: { look_id: string; looker_base_url: string }): Promise<MCPToolCallResponse>;
}
