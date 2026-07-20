/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface UberEatsListStoresParams { "limit"?: number; "offset"?: number }

export interface UberEatsGetStoreParams { store_id: string }

export interface UberEatsListOrdersParams { store_id: string; "limit"?: number; "offset"?: number }

export interface UberEatsGetOrderParams { order_id: string }

export interface UberEatsUpdateOrderStatusParams { order_id: string; status_json: string }

export interface UberEatsGetMenuParams { store_id: string }

