/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface EtsyGetShopParams { shop_id: string }

export interface EtsyListShopListingsParams { shop_id: string; "state"?: string; "limit"?: number; "offset"?: number }

export interface EtsyCreateListingParams { shop_id: string; listing_json: string }

export interface EtsyListReceiptsParams { shop_id: string; "limit"?: number; "offset"?: number }

export interface EtsyUpdateInventoryParams { listing_id: string; inventory_json: string }

