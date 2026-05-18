import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface UberEatsIntegrationClient {
  listStores(params: { "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  getStore(params: { store_id: string }): Promise<MCPToolCallResponse>;
  listOrders(params: { store_id: string; "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
  updateOrderStatus(params: { order_id: string; status_json: string }): Promise<MCPToolCallResponse>;
  getMenu(params: { store_id: string }): Promise<MCPToolCallResponse>;
}
