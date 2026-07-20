/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BigcommerceListProductsParams { "limit"?: number; "page"?: number; store_hash: string }

export interface BigcommerceGetProductParams { product_id: string; store_hash: string }

export interface BigcommerceCreateProductParams { product_json: string; store_hash: string }

export interface BigcommerceListOrdersParams { "limit"?: number; "page"?: number; "status_id"?: string; store_hash: string }

export interface BigcommerceGetOrderParams { order_id: string; store_hash: string }

export interface BigcommerceListCustomersParams { "limit"?: number; "page"?: number; store_hash: string }

