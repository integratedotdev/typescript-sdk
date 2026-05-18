import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FreeagentIntegrationClient {
  getCompany(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listContacts(params: { "page"?: number }): Promise<MCPToolCallResponse>;
  createContact(params: { contact_json: string }): Promise<MCPToolCallResponse>;
  listInvoices(params: { "view"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  createInvoice(params: { invoice_json: string }): Promise<MCPToolCallResponse>;
  listBills(params: { "page"?: number }): Promise<MCPToolCallResponse>;
}
