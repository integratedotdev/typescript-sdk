/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface EbaySearchItemsParams { q?: string; category_ids?: string; limit?: number; offset?: number }

export interface EbayGetItemParams { item_id: string }

export interface EbayListInventoryItemsParams { limit?: number; offset?: number }

export interface EbayCreateOrReplaceInventoryItemParams { sku: string; inventory_item_json: string }

export interface EbayListOffersParams { sku?: string; marketplace_id?: string; limit?: number; offset?: number }

export interface EbayCreateOfferParams { offer_json: string }

export interface EbayListOrdersParams { filter?: string; limit?: number; offset?: number }

export interface EbayGetOrderParams { order_id: string }

