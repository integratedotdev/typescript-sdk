/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AmazonSearchCatalogItemsParams { "marketplaceIds"?: string; "keywords"?: string; "identifiers"?: string; "pageSize"?: number }

export interface AmazonListOrdersParams { "MarketplaceIds"?: string; "CreatedAfter"?: string; "CreatedBefore"?: string; "OrderStatuses"?: string }

export interface AmazonGetOrderParams { order_id: string }

export interface AmazonListInventoryParams { "marketplaceIds"?: string; "details"?: boolean; "sellerSkus"?: string }

export interface AmazonListListingsParams { seller_id: string; "marketplaceIds"?: string; "includedData"?: string }

export interface AmazonPatchListingParams { seller_id: string; sku: string; listing_json: string }

