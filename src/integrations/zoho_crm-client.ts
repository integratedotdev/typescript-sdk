import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoCrmIntegrationClient {
  listModules(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listRecords(params: { module_api_name: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getRecord(params: { module_api_name: string; record_id: string }): Promise<MCPToolCallResponse>;
  createRecords(params: { module_api_name: string; records_json: string }): Promise<MCPToolCallResponse>;
  updateRecord(params: { module_api_name: string; record_id: string; record_json: string }): Promise<MCPToolCallResponse>;
  searchRecords(params: { module_api_name: string; criteria?: string; email?: string; phone?: string; word?: string }): Promise<MCPToolCallResponse>;
  coqlQuery(params: { query_json: string }): Promise<MCPToolCallResponse>;
  listUsers(params: { type?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getOrg(params?: Record<string, never>): Promise<MCPToolCallResponse>;
}
