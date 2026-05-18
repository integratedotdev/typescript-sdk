import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface EbayIntegrationClient {
  searchItems(params: { q?: string; category_ids?: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getItem(params: { item_id: string }): Promise<MCPToolCallResponse>;
  getPrivileges(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listInventoryItems(params: { limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  createOrReplaceInventoryItem(params: { sku: string; inventory_item_json: string }): Promise<MCPToolCallResponse>;
  listOffers(params: { sku?: string; marketplace_id?: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  createOffer(params: { offer_json: string }): Promise<MCPToolCallResponse>;
  listOrders(params: { filter?: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
}
