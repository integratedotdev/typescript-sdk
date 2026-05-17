import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SquareIntegrationClient {
  getMerchant(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listLocations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listCustomers(params?: { cursor?: string; limit?: number; sort_field?: string; sort_order?: string }): Promise<MCPToolCallResponse>;
  getCustomer(params: { customer_id: string }): Promise<MCPToolCallResponse>;
  createCustomer(params: { customer_json: string }): Promise<MCPToolCallResponse>;
  updateCustomer(params: { customer_id: string; customer_json: string }): Promise<MCPToolCallResponse>;
  deleteCustomer(params: { customer_id: string }): Promise<MCPToolCallResponse>;
  searchCatalog(params: { search_json: string }): Promise<MCPToolCallResponse>;
  retrieveCatalogObject(params: { object_id: string }): Promise<MCPToolCallResponse>;
  upsertCatalogObject(params: { object_json: string }): Promise<MCPToolCallResponse>;
  searchOrders(params: { search_json: string }): Promise<MCPToolCallResponse>;
  createOrder(params: { order_json: string }): Promise<MCPToolCallResponse>;
  payOrder(params: { order_id: string; pay_json: string }): Promise<MCPToolCallResponse>;
  listPayments(params?: { location_id?: string; cursor?: string; limit?: number; begin_time?: string; end_time?: string; sort_order?: string }): Promise<MCPToolCallResponse>;
  getPayment(params: { payment_id: string }): Promise<MCPToolCallResponse>;
  createPayment(params: { payment_json: string }): Promise<MCPToolCallResponse>;
  listRefunds(params?: { cursor?: string; limit?: number; location_id?: string; status?: string; source_type?: string }): Promise<MCPToolCallResponse>;
  refundPayment(params: { refund_json: string }): Promise<MCPToolCallResponse>;
  listInvoices(params?: { location_id?: string; cursor?: string; limit?: number }): Promise<MCPToolCallResponse>;
  getInvoice(params: { invoice_id: string }): Promise<MCPToolCallResponse>;
  createInvoice(params: { invoice_json: string }): Promise<MCPToolCallResponse>;
}

