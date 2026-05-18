import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TableauIntegrationClient {
  listSites(params: { tableau_base_url: string }): Promise<MCPToolCallResponse>;
  listWorkbooks(params: { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }): Promise<MCPToolCallResponse>;
  getWorkbook(params: { site_id: string; workbook_id: string; tableau_base_url: string }): Promise<MCPToolCallResponse>;
  listViews(params: { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }): Promise<MCPToolCallResponse>;
  listDatasources(params: { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }): Promise<MCPToolCallResponse>;
  runQueryViewData(params: { site_id: string; view_id: string; "maxAge"?: string; tableau_base_url: string }): Promise<MCPToolCallResponse>;
}
