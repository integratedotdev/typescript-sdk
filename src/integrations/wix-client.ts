/**
 * Wix Integration Client Types
 * Site-level REST API (API key + wix-site-id) for Stores and e-commerce.
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WixIntegrationClient {
  queryProducts(params?: { query?: Record<string, unknown> }): Promise<MCPToolCallResponse>;
  getProduct(params: { product_id: string }): Promise<MCPToolCallResponse>;
  createProduct(params: { body: Record<string, unknown> }): Promise<MCPToolCallResponse>;
  updateProduct(params: { product_id: string; body: Record<string, unknown> }): Promise<MCPToolCallResponse>;
  searchOrders(params?: { search?: Record<string, unknown> }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
}
