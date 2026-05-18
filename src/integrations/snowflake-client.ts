import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SnowflakeIntegrationClient {
  submitStatement(params: { statement_json: string; account: string }): Promise<MCPToolCallResponse>;
  getStatement(params: { statement_handle: string; "partition"?: string; account: string }): Promise<MCPToolCallResponse>;
  cancelStatement(params: { statement_handle: string; account: string }): Promise<MCPToolCallResponse>;
  listDatabases(params: { statement_json: string; account: string }): Promise<MCPToolCallResponse>;
  listWarehouses(params: { statement_json: string; account: string }): Promise<MCPToolCallResponse>;
}
