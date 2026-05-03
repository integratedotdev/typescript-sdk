import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface XeroIntegrationClient {
  listConnections(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getOrganisation(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listAccounts(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listContacts(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getContact(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createContact(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listInvoices(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getInvoice(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createInvoice(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listBankTransactions(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
