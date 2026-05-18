import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TruelayerIntegrationClient {
  getMe(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listAccounts(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getAccount(params: { account_id: string }): Promise<MCPToolCallResponse>;
  getBalance(params: { account_id: string }): Promise<MCPToolCallResponse>;
  listTransactions(params: { account_id: string; "from"?: string; "to"?: string }): Promise<MCPToolCallResponse>;
  listCards(params: Record<string, never>): Promise<MCPToolCallResponse>;
}
