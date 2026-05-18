import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoInvoiceIntegrationClient {
  listOrganizations(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listContacts(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listItems(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listEstimates(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listInvoices(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listCustomerpayments(params: { organization_id?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  createInvoice(params: { organization_id?: string; invoice_json: string }): Promise<MCPToolCallResponse>;
  getAgingSummary(params: { organization_id?: string }): Promise<MCPToolCallResponse>;
}
