/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SquarespaceListOrdersParams {
    "limit"?: number;
    "cursor"?: string;
    "fulfillmentStatus"?: string;
    "modifiedAfter"?: string;
  }

export interface SquarespaceGetOrderParams {
    "order_id": string;
  }

export interface SquarespaceListProductsParams {
    "limit"?: number;
    "cursor"?: string;
  }

export interface SquarespaceGetProductParams {
    "product_id": string;
  }

export interface SquarespaceListInventoryParams {
    "limit"?: number;
    "cursor"?: string;
  }

export interface SquarespaceAdjustInventoryParams {
    "adjustment_json": string;
  }

