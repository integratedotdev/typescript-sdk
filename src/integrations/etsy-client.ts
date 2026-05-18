import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface EtsyIntegrationClient {
  getMe(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getShop(params: { shop_id: string }): Promise<MCPToolCallResponse>;
  listShopListings(params: { shop_id: string; "state"?: string; "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  createListing(params: { shop_id: string; listing_json: string }): Promise<MCPToolCallResponse>;
  listReceipts(params: { shop_id: string; "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  updateInventory(params: { listing_id: string; inventory_json: string }): Promise<MCPToolCallResponse>;
}
