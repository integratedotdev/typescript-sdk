import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SmartsheetIntegrationClient {
  listSheets(params: { page?: number; pageSize?: number; includeAll?: boolean }): Promise<MCPToolCallResponse>;
  getSheet(params: { sheet_id: string; include?: string; page?: number; pageSize?: number }): Promise<MCPToolCallResponse>;
  createSheet(params: { sheet_json: string }): Promise<MCPToolCallResponse>;
  addRows(params: { sheet_id: string; rows_json: string }): Promise<MCPToolCallResponse>;
  updateRows(params: { sheet_id: string; rows_json: string }): Promise<MCPToolCallResponse>;
  listWorkspaces(params: { page?: number; pageSize?: number }): Promise<MCPToolCallResponse>;
  listReports(params: { page?: number; pageSize?: number }): Promise<MCPToolCallResponse>;
  listAttachments(params: { sheet_id: string }): Promise<MCPToolCallResponse>;
}
