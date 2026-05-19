import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SquarespaceIntegrationClient {
  listOrders(params: {
    "limit"?: number;
    "cursor"?: string;
    "fulfillmentStatus"?: string;
    "modifiedAfter"?: string;
  }): Promise<MCPToolCallResponse>;
  getOrder(params: {
    "order_id": string;
  }): Promise<MCPToolCallResponse>;
  listProducts(params: {
    "limit"?: number;
    "cursor"?: string;
  }): Promise<MCPToolCallResponse>;
  getProduct(params: {
    "product_id": string;
  }): Promise<MCPToolCallResponse>;
  listInventory(params: {
    "limit"?: number;
    "cursor"?: string;
  }): Promise<MCPToolCallResponse>;
  adjustInventory(params: {
    "adjustment_json": string;
  }): Promise<MCPToolCallResponse>;
}
