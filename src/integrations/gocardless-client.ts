import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GocardlessIntegrationClient {
  listInstitutions(params: { "country"?: string }): Promise<MCPToolCallResponse>;
  createRequisition(params: { requisition_json: string }): Promise<MCPToolCallResponse>;
  getRequisition(params: { requisition_id: string }): Promise<MCPToolCallResponse>;
  getAccount(params: { account_id: string }): Promise<MCPToolCallResponse>;
  getBalances(params: { account_id: string }): Promise<MCPToolCallResponse>;
  getTransactions(params: { account_id: string }): Promise<MCPToolCallResponse>;
}
