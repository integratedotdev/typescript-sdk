/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PaypalCreateOrderParams { order_json: string }

export interface PaypalGetOrderParams { order_id: string }

export interface PaypalCaptureOrderParams { order_id: string; capture_json: string }

export interface PaypalGetCaptureParams { capture_id: string }

export interface PaypalRefundCaptureParams { capture_id: string; refund_json: string }

export interface PaypalGetRefundParams { refund_id: string }

export interface PaypalListInvoicesParams { page?: number; page_size?: number; total_required?: boolean }

export interface PaypalGetInvoiceParams { invoice_id: string }

export interface PaypalCreateInvoiceParams { invoice_json: string }

export interface PaypalSendInvoiceParams { invoice_id: string; send_json: string }

export interface PaypalListProductsParams { page_size?: number; page?: number; total_required?: boolean }

export interface PaypalCreateProductParams { product_json: string }

export interface PaypalListPlansParams { product_id?: string; plan_ids?: string; page_size?: number; page?: number; total_required?: boolean }

export interface PaypalCreatePlanParams { plan_json: string }

export interface PaypalGetSubscriptionParams { subscription_id: string }

export interface PaypalCancelSubscriptionParams { subscription_id: string; cancel_json: string }

