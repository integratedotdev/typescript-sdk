/**
 * Stripe Integration Client Types
 * Fully typed interface for Stripe integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Stripe Customer
 */
export interface StripeCustomer {
  id: string;
  object: "customer";
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  balance: number;
  created: number;
  currency?: string;
  default_source?: string;
  delinquent: boolean;
  description?: string;
  discount?: Record<string, unknown>;
  email?: string;
  invoice_prefix?: string;
  invoice_settings?: {
    custom_fields?: Array<{ name: string; value: string }>;
    default_payment_method?: string;
    footer?: string;
    rendering_options?: Record<string, unknown>;
  };
  livemode: boolean;
  metadata: Record<string, string>;
  name?: string;
  phone?: string;
  preferred_locales?: string[];
  shipping?: {
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    name?: string;
    phone?: string;
  };
  tax_exempt?: "none" | "exempt" | "reverse";
}

/**
 * Stripe Payment Intent
 */
export interface StripePaymentIntent {
  id: string;
  object: "payment_intent";
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application?: string;
  application_fee_amount?: number;
  canceled_at?: number;
  cancellation_reason?: string;
  capture_method: "automatic" | "manual";
  client_secret: string;
  confirmation_method: "automatic" | "manual";
  created: number;
  currency: string;
  customer?: string;
  description?: string;
  invoice?: string;
  last_payment_error?: Record<string, unknown>;
  livemode: boolean;
  metadata: Record<string, string>;
  payment_method?: string;
  payment_method_types: string[];
  receipt_email?: string;
  status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "processing" | "requires_capture" | "canceled" | "succeeded";
}

/**
 * Stripe Invoice
 */
export interface StripeInvoice {
  id: string;
  object: "invoice";
  account_country?: string;
  account_name?: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  attempt_count: number;
  attempted: boolean;
  auto_advance?: boolean;
  billing_reason?: string;
  charge?: string;
  collection_method?: "charge_automatically" | "send_invoice";
  created: number;
  currency: string;
  customer: string;
  customer_email?: string;
  customer_name?: string;
  description?: string;
  due_date?: number;
  ending_balance?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  livemode: boolean;
  metadata: Record<string, string>;
  number?: string;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent?: string;
  period_end: number;
  period_start: number;
  status?: "draft" | "open" | "paid" | "uncollectible" | "void";
  subscription?: string;
  subtotal: number;
  total: number;
}

/**
 * Stripe Subscription
 */
export interface StripeSubscription {
  id: string;
  object: "subscription";
  application?: string;
  application_fee_percent?: number;
  billing_cycle_anchor: number;
  cancel_at?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  collection_method: "charge_automatically" | "send_invoice";
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due?: number;
  default_payment_method?: string;
  description?: string;
  discount?: Record<string, unknown>;
  ended_at?: number;
  items: {
    object: "list";
    data: Array<{
      id: string;
      object: "subscription_item";
      price: {
        id: string;
        product: string;
        unit_amount?: number;
        currency: string;
      };
      quantity?: number;
    }>;
  };
  livemode: boolean;
  metadata: Record<string, string>;
  start_date: number;
  status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused";
  trial_end?: number;
  trial_start?: number;
}

/**
 * Stripe Integration Client Interface
 * Provides type-safe methods for all Stripe operations
 */
export interface StripeIntegrationClient {
  /**
   * List customers
   * 
   * @example
   * ```typescript
   * const customers = await client.stripe.listCustomers({
   *   limit: 10
   * });
   * ```
   */
  listCustomers(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific customer
   * 
   * @example
   * ```typescript
   * const customer = await client.stripe.getCustomer({
   *   customer_id: "cus_xxxxx"
   * });
   * ```
   */
  getCustomer(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new customer
   * 
   * @example
   * ```typescript
   * const customer = await client.stripe.createCustomer({
   *   email: "customer@example.com",
   *   name: "John Doe"
   * });
   * ```
   */
  createCustomer(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List payment intents
   * 
   * @example
   * ```typescript
   * const payments = await client.stripe.listPayments({
   *   customer: "cus_xxxxx"
   * });
   * ```
   */
  listPayments(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific payment intent
   * 
   * @example
   * ```typescript
   * const payment = await client.stripe.getPayment({
   *   payment_id: "pi_xxxxx"
   * });
   * ```
   */
  getPayment(params: {
    /** Payment Intent ID */
    payment_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a payment intent
   * 
   * @example
   * ```typescript
   * const payment = await client.stripe.createPayment({
   *   amount: 2000,
   *   currency: "usd",
   *   customer: "cus_xxxxx"
   * });
   * ```
   */
  createPayment(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List invoices
   * 
   * @example
   * ```typescript
   * const invoices = await client.stripe.listInvoices({
   *   customer: "cus_xxxxx",
   *   status: "paid"
   * });
   * ```
   */
  listInvoices(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List subscriptions
   * 
   * @example
   * ```typescript
   * const subscriptions = await client.stripe.listSubscriptions({
   *   customer: "cus_xxxxx",
   *   status: "active"
   * });
   * ```
   */
  listSubscriptions(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a subscription
   * 
   * @example
   * ```typescript
   * const subscription = await client.stripe.createSubscription({
   *   customer: "cus_xxxxx",
   *   items: [{ price: "price_xxxxx" }]
   * });
   * ```
   */
  createSubscription(params: {
    /** Customer ID */
    customer: string;
    /** Subscription items */
    items: Array<{
      /** Price ID */
      price: string;
      /** Quantity */
      quantity?: number;
    }>;
    /** Default payment method */
    default_payment_method?: string;
    /** Trial end timestamp or 'now' */
    trial_end?: number | "now";
    /** Trial period in days */
    trial_period_days?: number;
    /** Metadata key-value pairs */
    metadata?: Record<string, string>;
    /** Cancel at period end */
    cancel_at_period_end?: boolean;
  }): Promise<MCPToolCallResponse>;
}

