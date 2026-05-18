import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AmazonIntegrationClient {
  searchCatalogItems(params: { "marketplaceIds"?: string; "keywords"?: string; "identifiers"?: string; "pageSize"?: number }): Promise<MCPToolCallResponse>;
  listOrders(params: { "MarketplaceIds"?: string; "CreatedAfter"?: string; "CreatedBefore"?: string; "OrderStatuses"?: string }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
  listInventory(params: { "marketplaceIds"?: string; "details"?: boolean; "sellerSkus"?: string }): Promise<MCPToolCallResponse>;
  listListings(params: { seller_id: string; "marketplaceIds"?: string; "includedData"?: string }): Promise<MCPToolCallResponse>;
  patchListing(params: { seller_id: string; sku: string; listing_json: string }): Promise<MCPToolCallResponse>;
}
