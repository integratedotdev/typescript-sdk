import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PlaidIntegrationClient {
  createLinkToken(params: { link_token_json: string }): Promise<MCPToolCallResponse>;
  exchangePublicToken(params: { exchange_json: string }): Promise<MCPToolCallResponse>;
  getAccounts(params: { accounts_json: string }): Promise<MCPToolCallResponse>;
  getTransactions(params: { transactions_json: string }): Promise<MCPToolCallResponse>;
  getIdentity(params: { identity_json: string }): Promise<MCPToolCallResponse>;
  getInvestments(params: { investments_json: string }): Promise<MCPToolCallResponse>;
}
