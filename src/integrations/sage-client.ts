import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SageIntegrationClient {
  getBusiness(params: { business_id: string }): Promise<MCPToolCallResponse>;
  listContacts(params: { "page"?: number; "items_per_page"?: number }): Promise<MCPToolCallResponse>;
  createContact(params: { contact_json: string }): Promise<MCPToolCallResponse>;
  listProducts(params: { "page"?: number; "items_per_page"?: number }): Promise<MCPToolCallResponse>;
  listSalesInvoices(params: { "page"?: number; "items_per_page"?: number }): Promise<MCPToolCallResponse>;
  createSalesInvoice(params: { invoice_json: string }): Promise<MCPToolCallResponse>;
}
