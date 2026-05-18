import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BigcommerceIntegrationClient {
  listProducts(params: { "limit"?: number; "page"?: number; store_hash: string }): Promise<MCPToolCallResponse>;
  getProduct(params: { product_id: string; store_hash: string }): Promise<MCPToolCallResponse>;
  createProduct(params: { product_json: string; store_hash: string }): Promise<MCPToolCallResponse>;
  listOrders(params: { "limit"?: number; "page"?: number; "status_id"?: string; store_hash: string }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string; store_hash: string }): Promise<MCPToolCallResponse>;
  listCustomers(params: { "limit"?: number; "page"?: number; store_hash: string }): Promise<MCPToolCallResponse>;
}
