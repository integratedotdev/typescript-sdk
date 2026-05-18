import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoMailIntegrationClient {
  listAccounts(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listFolders(params: { account_id: string }): Promise<MCPToolCallResponse>;
  listMessages(params: { account_id: string; folderId?: string; limit?: number; start?: number }): Promise<MCPToolCallResponse>;
  getMessage(params: { account_id: string; message_id: string }): Promise<MCPToolCallResponse>;
  sendMessage(params: { account_id: string; message_json: string }): Promise<MCPToolCallResponse>;
  searchMessages(params: { account_id: string; searchKey?: string; limit?: number; start?: number }): Promise<MCPToolCallResponse>;
  listLabels(params: { account_id: string }): Promise<MCPToolCallResponse>;
}
