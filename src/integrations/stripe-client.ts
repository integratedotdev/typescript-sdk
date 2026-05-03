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
   * Get an invoice by ID
   *
   * @example
   * ```typescript
   * const invoice = await client.stripe.getInvoice({ invoice_id: "in_xxxxx" });
   * ```
   */
  getInvoice(params: {
    /** Invoice ID */
    invoice_id: string;
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
   *   price: "price_xxxxx"
   * });
   * ```
   */
  createSubscription(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Customers (additional) ────────────────────────────────

  /**
   * Update an existing customer
   *
   * @example
   * ```typescript
   * await client.stripe.updateCustomer({ customer_id: "cus_xxxxx", email: "new@example.com" });
   * ```
   */
  updateCustomer(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a customer
   *
   * @example
   * ```typescript
   * await client.stripe.deleteCustomer({ customer_id: "cus_xxxxx" });
   * ```
   */
  deleteCustomer(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search customers using Stripe search syntax
   *
   * @example
   * ```typescript
   * const results = await client.stripe.searchCustomers({ query: "email:'user@example.com'" });
   * ```
   */
  searchCustomers(params: {
    /** Stripe search query (e.g. "email:'user@example.com'") */
    query: string;
    /** Maximum number of results */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  // ── Payment Intents (additional) ──────────────────────────

  /**
   * Cancel a payment intent
   *
   * @example
   * ```typescript
   * await client.stripe.cancelPayment({ payment_id: "pi_xxxxx" });
   * ```
   */
  cancelPayment(params: {
    /** Payment Intent ID */
    payment_id: string;
    /** Reason for cancellation */
    cancellation_reason?: "duplicate" | "fraudulent" | "requested_by_customer" | "abandoned";
  }): Promise<MCPToolCallResponse>;

  /**
   * Capture an authorized payment intent
   *
   * @example
   * ```typescript
   * await client.stripe.capturePayment({ payment_id: "pi_xxxxx" });
   * ```
   */
  capturePayment(params: {
    /** Payment Intent ID */
    payment_id: string;
    /** Amount to capture in cents (defaults to full authorized amount) */
    amount_to_capture?: number;
  }): Promise<MCPToolCallResponse>;

  // ── Subscriptions (additional) ────────────────────────────

  /**
   * Get a subscription by ID
   *
   * @example
   * ```typescript
   * const sub = await client.stripe.getSubscription({ subscription_id: "sub_xxxxx" });
   * ```
   */
  getSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a subscription
   *
   * @example
   * ```typescript
   * await client.stripe.updateSubscription({ subscription_id: "sub_xxxxx", quantity: 5 });
   * ```
   */
  updateSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
    /** New price ID */
    price?: string;
    /** New quantity */
    quantity?: number;
    /** Collection method */
    collection_method?: "charge_automatically" | "send_invoice";
  }): Promise<MCPToolCallResponse>;

  /**
   * Cancel a subscription
   *
   * @example
   * ```typescript
   * await client.stripe.cancelSubscription({ subscription_id: "sub_xxxxx" });
   * ```
   */
  cancelSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
    /** If true, cancels at the end of the billing period instead of immediately */
    at_period_end?: boolean;
  }): Promise<MCPToolCallResponse>;

  // ── Invoices (additional) ─────────────────────────────────

  /**
   * Create an invoice for a customer
   *
   * @example
   * ```typescript
   * await client.stripe.createInvoice({ customer: "cus_xxxxx", collection_method: "send_invoice", days_until_due: 30 });
   * ```
   */
  createInvoice(params: {
    /** Customer ID */
    customer: string;
    /** Collection method */
    collection_method?: "charge_automatically" | "send_invoice";
    /** Days until invoice is due (required when collection_method is send_invoice) */
    days_until_due?: number;
    /** Invoice description */
    description?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Finalize a draft invoice
   *
   * @example
   * ```typescript
   * await client.stripe.finalizeInvoice({ invoice_id: "in_xxxxx" });
   * ```
   */
  finalizeInvoice(params: {
    /** Invoice ID */
    invoice_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Pay an open invoice immediately
   *
   * @example
   * ```typescript
   * await client.stripe.payInvoice({ invoice_id: "in_xxxxx" });
   * ```
   */
  payInvoice(params: {
    /** Invoice ID */
    invoice_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Void an invoice (cannot be undone)
   *
   * @example
   * ```typescript
   * await client.stripe.voidInvoice({ invoice_id: "in_xxxxx" });
   * ```
   */
  voidInvoice(params: {
    /** Invoice ID */
    invoice_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Products ──────────────────────────────────────────────

  /**
   * List products
   *
   * @example
   * ```typescript
   * const products = await client.stripe.listProducts({ active: true });
   * ```
   */
  listProducts(params?: {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by active status */
    active?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a product by ID
   *
   * @example
   * ```typescript
   * const product = await client.stripe.getProduct({ product_id: "prod_xxxxx" });
   * ```
   */
  getProduct(params: {
    /** Product ID */
    product_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a product
   *
   * @example
   * ```typescript
   * const product = await client.stripe.createProduct({ name: "Pro Plan" });
   * ```
   */
  createProduct(params: {
    /** Product name */
    name: string;
    /** Product description */
    description?: string;
    /** Whether the product is active */
    active?: boolean;
  }): Promise<MCPToolCallResponse>;

  // ── Prices ────────────────────────────────────────────────

  /**
   * List prices
   *
   * @example
   * ```typescript
   * const prices = await client.stripe.listPrices({ product: "prod_xxxxx" });
   * ```
   */
  listPrices(params?: {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by product ID */
    product?: string;
    /** Filter by active status */
    active?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a price by ID
   *
   * @example
   * ```typescript
   * const price = await client.stripe.getPrice({ price_id: "price_xxxxx" });
   * ```
   */
  getPrice(params: {
    /** Price ID */
    price_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a price for a product
   *
   * @example
   * ```typescript
   * const price = await client.stripe.createPrice({
   *   product: "prod_xxxxx",
   *   currency: "usd",
   *   unit_amount: 1000,
   *   recurring_interval: "month"
   * });
   * ```
   */
  createPrice(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Refunds ───────────────────────────────────────────────

  /**
   * List refunds
   *
   * @example
   * ```typescript
   * const refunds = await client.stripe.listRefunds({ payment_intent: "pi_xxxxx" });
   * ```
   */
  listRefunds(params?: {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by payment intent ID */
    payment_intent?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a refund by ID
   *
   * @example
   * ```typescript
   * const refund = await client.stripe.getRefund({ refund_id: "re_xxxxx" });
   * ```
   */
  getRefund(params: {
    /** Refund ID */
    refund_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a refund for a payment
   *
   * @example
   * ```typescript
   * await client.stripe.createRefund({ payment_intent: "pi_xxxxx", amount: 500 });
   * ```
   */
  createRefund(params: {
    /** Payment Intent ID to refund */
    payment_intent: string;
    /** Amount to refund in cents (defaults to full amount) */
    amount?: number;
    /** Reason for the refund */
    reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  }): Promise<MCPToolCallResponse>;

  // ── Balance ───────────────────────────────────────────────

  /**
   * Get the current Stripe account balance
   *
   * @example
   * ```typescript
   * const balance = await client.stripe.getBalance();
   * ```
   */
  getBalance(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  // ── Events ────────────────────────────────────────────────

  /**
   * List events from the Stripe event log
   *
   * @example
   * ```typescript
   * const events = await client.stripe.listEvents({ type: "payment_intent.succeeded", limit: 20 });
   * ```
   */
  listEvents(params?: {
    /** Maximum number to return */
    limit?: number;
    /** Cursor for pagination */
    starting_after?: string;
    /** Filter by event type (e.g. "payment_intent.succeeded") */
    type?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific event by ID
   *
   * @example
   * ```typescript
   * const event = await client.stripe.getEvent({ event_id: "evt_xxxxx" });
   * ```
   */
  getEvent(params: {
    /** Event ID */
    event_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Payment Methods ───────────────────────────────────────

  /**
   * List payment methods for a customer
   *
   * @example
   * ```typescript
   * const methods = await client.stripe.listPaymentMethods({ customer: "cus_xxxxx" });
   * ```
   */
  listPaymentMethods(params: {
    /** Customer ID */
    customer: string;
    /** Filter by payment method type (e.g. "card") */
    type?: string;
    /** Maximum number to return */
    limit?: number;
  }): Promise<MCPToolCallResponse>;
}
