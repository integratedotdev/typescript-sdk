import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MoneybirdIntegrationClient {
  listAdministrations(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listContacts(params: { administration_id: string; "query"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  createContact(params: { administration_id: string; contact_json: string }): Promise<MCPToolCallResponse>;
  listSalesInvoices(params: { administration_id: string; "filter"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  createSalesInvoice(params: { administration_id: string; invoice_json: string }): Promise<MCPToolCallResponse>;
  listFinancialAccounts(params: { administration_id: string }): Promise<MCPToolCallResponse>;
}
