/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SquareListCustomersParams { cursor?: string; limit?: number; sort_field?: string; sort_order?: string }

export interface SquareGetCustomerParams { customer_id: string }

export interface SquareCreateCustomerParams { customer_json: string }

export interface SquareUpdateCustomerParams { customer_id: string; customer_json: string }

export interface SquareDeleteCustomerParams { customer_id: string }

export interface SquareSearchCatalogParams { search_json: string }

export interface SquareRetrieveCatalogObjectParams { object_id: string }

export interface SquareUpsertCatalogObjectParams { object_json: string }

export interface SquareSearchOrdersParams { search_json: string }

export interface SquareCreateOrderParams { order_json: string }

export interface SquarePayOrderParams { order_id: string; pay_json: string }

export interface SquareListPaymentsParams { location_id?: string; cursor?: string; limit?: number; begin_time?: string; end_time?: string; sort_order?: string }

export interface SquareGetPaymentParams { payment_id: string }

export interface SquareCreatePaymentParams { payment_json: string }

export interface SquareListRefundsParams { cursor?: string; limit?: number; location_id?: string; status?: string; source_type?: string }

export interface SquareRefundPaymentParams { refund_json: string }

export interface SquareListInvoicesParams { location_id?: string; cursor?: string; limit?: number }

export interface SquareGetInvoiceParams { invoice_id: string }

export interface SquareCreateInvoiceParams { invoice_json: string }

