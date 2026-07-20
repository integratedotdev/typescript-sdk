/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface StripeListCustomersParams {
    /** Maximum number of customers to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Cursor for pagination (reverse) */
    ending_before?: string;
    /** Filter by email */
    email?: string;
    /** Filter by creation date */
    created?: {
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
  }

export interface StripeGetCustomerParams {
    /** Customer ID */
    customer_id: string;
  }

export interface StripeCreateCustomerParams {
    /** Customer email */
    email?: string;
    /** Customer name */
    name?: string;
    /** Customer phone */
    phone?: string;
    /** Customer description */
    description?: string;
    /** Metadata key-value pairs */
    metadata?: Record<string, string>;
    /** Payment method ID */
    payment_method?: string;
    /** Customer address */
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
  }

export interface StripeListPaymentsParams {
    /** Filter by customer */
    customer?: string;
    /** Maximum number of payments to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by creation date */
    created?: {
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
  }

export interface StripeGetPaymentParams {
    /** Payment Intent ID */
    payment_id: string;
  }

export interface StripeCreatePaymentParams {
    /** Amount in cents */
    amount: number;
    /** Three-letter ISO currency code */
    currency: string;
    /** Customer ID */
    customer?: string;
    /** Description */
    description?: string;
    /** Payment method ID */
    payment_method?: string;
    /** Whether to confirm immediately */
    confirm?: boolean;
    /** Metadata key-value pairs */
    metadata?: Record<string, string>;
    /** Receipt email */
    receipt_email?: string;
  }

export interface StripeListInvoicesParams {
    /** Filter by customer */
    customer?: string;
    /** Filter by subscription */
    subscription?: string;
    /** Filter by status */
    status?: "draft" | "open" | "paid" | "uncollectible" | "void";
    /** Maximum number of invoices to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by creation date */
    created?: {
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
  }

export interface StripeGetInvoiceParams {
    /** Invoice ID */
    invoice_id: string;
  }

export interface StripeListSubscriptionsParams {
    /** Filter by customer */
    customer?: string;
    /** Filter by price */
    price?: string;
    /** Filter by status */
    status?: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused" | "all";
    /** Maximum number of subscriptions to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by creation date */
    created?: {
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
  }

export interface StripeCreateSubscriptionParams {
    /** Customer ID */
    customer: string;
    /** Price ID */
    price: string;
    /** Quantity */
    quantity?: number;
    /** Number of trial days */
    trial_period_days?: number;
    /** Collection method */
    collection_method?: "charge_automatically" | "send_invoice";
  }

export interface StripeUpdateCustomerParams {
    /** Customer ID */
    customer_id: string;
    /** New email address */
    email?: string;
    /** New name */
    name?: string;
    /** New description */
    description?: string;
    /** New phone number */
    phone?: string;
  }

export interface StripeDeleteCustomerParams {
    /** Customer ID */
    customer_id: string;
  }

export interface StripeSearchCustomersParams {
    /** Stripe search query (e.g. "email:'user@example.com'") */
    query: string;
    /** Maximum number of results */
    limit?: number;
  }

export interface StripeCancelPaymentParams {
    /** Payment Intent ID */
    payment_id: string;
    /** Reason for cancellation */
    cancellation_reason?: "duplicate" | "fraudulent" | "requested_by_customer" | "abandoned";
  }

export interface StripeCapturePaymentParams {
    /** Payment Intent ID */
    payment_id: string;
    /** Amount to capture in cents (defaults to full authorized amount) */
    amount_to_capture?: number;
  }

export interface StripeGetSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
  }

export interface StripeUpdateSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
    /** New price ID */
    price?: string;
    /** New quantity */
    quantity?: number;
    /** Collection method */
    collection_method?: "charge_automatically" | "send_invoice";
  }

export interface StripeCancelSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
    /** If true, cancels at the end of the billing period instead of immediately */
    at_period_end?: boolean;
  }

export interface StripeCreateInvoiceParams {
    /** Customer ID */
    customer: string;
    /** Collection method */
    collection_method?: "charge_automatically" | "send_invoice";
    /** Days until invoice is due (required when collection_method is send_invoice) */
    days_until_due?: number;
    /** Invoice description */
    description?: string;
  }

export interface StripeFinalizeInvoiceParams {
    /** Invoice ID */
    invoice_id: string;
  }

export interface StripePayInvoiceParams {
    /** Invoice ID */
    invoice_id: string;
  }

export interface StripeVoidInvoiceParams {
    /** Invoice ID */
    invoice_id: string;
  }

export interface StripeListProductsParams {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by active status */
    active?: boolean;
  }

export interface StripeGetProductParams {
    /** Product ID */
    product_id: string;
  }

export interface StripeCreateProductParams {
    /** Product name */
    name: string;
    /** Product description */
    description?: string;
    /** Whether the product is active */
    active?: boolean;
  }

export interface StripeListPricesParams {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by product ID */
    product?: string;
    /** Filter by active status */
    active?: boolean;
  }

export interface StripeGetPriceParams {
    /** Price ID */
    price_id: string;
  }

export interface StripeCreatePriceParams {
    /** Product ID to attach this price to */
    product: string;
    /** Three-letter ISO currency code */
    currency: string;
    /** Amount in cents */
    unit_amount: number;
    /** Billing interval for recurring prices */
    recurring_interval?: "day" | "week" | "month" | "year";
    /** Number of intervals between billings (default: 1) */
    recurring_interval_count?: number;
  }

export interface StripeListRefundsParams {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by payment intent ID */
    payment_intent?: string;
  }

export interface StripeGetRefundParams {
    /** Refund ID */
    refund_id: string;
  }

export interface StripeCreateRefundParams {
    /** Payment Intent ID to refund */
    payment_intent: string;
    /** Amount to refund in cents (defaults to full amount) */
    amount?: number;
    /** Reason for the refund */
    reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  }

export interface StripeListEventsParams {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by event type (e.g. "payment_intent.succeeded") */
    type?: string;
  }

export interface StripeGetEventParams {
    /** Event ID */
    event_id: string;
  }

export interface StripeListPaymentMethodsParams {
    /** Customer ID */
    customer: string;
    /** Filter by payment method type (e.g. "card") */
    type?: string;
    /** Maximum number to return */
    limit?: number;
  }

