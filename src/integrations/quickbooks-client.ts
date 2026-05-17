import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface QuickBooksIntegrationClient {
  getCompanyInfo(params: { company_id: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  query(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listCustomers(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  getCustomer(params: { company_id: string; customer_id: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createCustomer(params: { company_id: string; customer_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listVendors(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createVendor(params: { company_id: string; vendor_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listItems(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createItem(params: { company_id: string; item_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listAccounts(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listInvoices(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  getInvoice(params: { company_id: string; invoice_id: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createInvoice(params: { company_id: string; invoice_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  listBills(params: { company_id: string; query: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createBill(params: { company_id: string; bill_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  createPayment(params: { company_id: string; payment_json: string; minorversion?: number }): Promise<MCPToolCallResponse>;
  getReport(params: { company_id: string; report_name: string; start_date?: string; end_date?: string; accounting_method?: string; minorversion?: number }): Promise<MCPToolCallResponse>;
}

