import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TinkIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listAccounts(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getAccount(params: { account_id: string }): Promise<MCPToolCallResponse>;
  listTransactions(params: { "startDate"?: string; "endDate"?: string }): Promise<MCPToolCallResponse>;
  listCredentials(params: Record<string, never>): Promise<MCPToolCallResponse>;
  refreshCredentials(params: { credential_id: string }): Promise<MCPToolCallResponse>;
}
