import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PayPalIntegrationClient {
  createOrder(params: { order_json: string }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
  captureOrder(params: { order_id: string; capture_json: string }): Promise<MCPToolCallResponse>;
  getCapture(params: { capture_id: string }): Promise<MCPToolCallResponse>;
  refundCapture(params: { capture_id: string; refund_json: string }): Promise<MCPToolCallResponse>;
  getRefund(params: { refund_id: string }): Promise<MCPToolCallResponse>;
  listInvoices(params?: { page?: number; page_size?: number; total_required?: boolean }): Promise<MCPToolCallResponse>;
  getInvoice(params: { invoice_id: string }): Promise<MCPToolCallResponse>;
  createInvoice(params: { invoice_json: string }): Promise<MCPToolCallResponse>;
  sendInvoice(params: { invoice_id: string; send_json: string }): Promise<MCPToolCallResponse>;
  listProducts(params?: { page_size?: number; page?: number; total_required?: boolean }): Promise<MCPToolCallResponse>;
  createProduct(params: { product_json: string }): Promise<MCPToolCallResponse>;
  listPlans(params?: { product_id?: string; plan_ids?: string; page_size?: number; page?: number; total_required?: boolean }): Promise<MCPToolCallResponse>;
  createPlan(params: { plan_json: string }): Promise<MCPToolCallResponse>;
  getSubscription(params: { subscription_id: string }): Promise<MCPToolCallResponse>;
  cancelSubscription(params: { subscription_id: string; cancel_json: string }): Promise<MCPToolCallResponse>;
}

