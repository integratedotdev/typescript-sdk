/**
 * Polar Integration Client Types
 * Fully typed interface for Polar integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Polar Product
 */
export interface PolarProduct {
  id: string;
  name: string;
  description?: string;
  is_recurring: boolean;
  is_archived: boolean;
  organization_id: string;
  prices: Array<{
    id: string;
    created_at: string;
    modified_at?: string;
    amount_type: "fixed" | "custom";
    price_amount?: number;
    price_currency?: string;
    recurring_interval?: "month" | "year";
  }>;
  benefits: Array<{
    id: string;
    type: string;
    description: string;
  }>;
  medias: Array<{
    id: string;
    organization_id: string;
    name: string;
    path: string;
    mime_type: string;
    size: number;
    public_url: string;
  }>;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Subscription
 */
export interface PolarSubscription {
  id: string;
  status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid";
  current_period_start: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  started_at?: string;
  ended_at?: string;
  customer_id: string;
  product_id: string;
  price_id: string;
  created_at: string;
  modified_at?: string;
  user_id: string;
  product: {
    id: string;
    name: string;
  };
  price: {
    id: string;
    price_amount?: number;
    price_currency?: string;
    recurring_interval?: "month" | "year";
  };
}

/**
 * Polar Customer
 */
export interface PolarCustomer {
  id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  billing_address?: {
    country: string;
  };
  tax_id?: string;
  organization_id?: string;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Order
 */
export interface PolarOrder {
  id: string;
  amount: number;
  tax_amount: number;
  currency: string;
  billing_reason: string;
  customer_id: string;
  product_id: string;
  product_price_id: string;
  subscription_id?: string;
  created_at: string;
  user_id: string;
  product: {
    id: string;
    name: string;
  };
  product_price: {
    id: string;
    price_amount?: number;
    price_currency?: string;
  };
}

/**
 * Polar Benefit
 */
export interface PolarBenefit {
  id: string;
  type: "custom" | "articles" | "discord" | "github_repository" | "downloadables" | "license_keys";
  description: string;
  selectable: boolean;
  deletable: boolean;
  organization_id: string;
  properties: Record<string, any>;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Discount
 */
export interface PolarDiscount {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  amount: number;
  code?: string;
  organization_id: string;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Checkout Link
 */
export interface PolarCheckoutLink {
  id: string;
  url: string;
  product_price_id: string;
  success_url?: string;
  organization_id: string;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar License Key
 */
export interface PolarLicenseKey {
  id: string;
  key: string;
  status: "granted" | "activated" | "revoked";
  customer_id: string;
  benefit_id: string;
  organization_id: string;
  activations: number;
  limit_activations?: number;
  expires_at?: string;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Organization
 */
export interface PolarOrganization {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  created_at: string;
  modified_at?: string;
}

/**
 * Polar Metrics Response
 */
export interface PolarMetrics {
  periods: Array<{
    start_date: string;
    end_date: string;
    revenue: number;
    orders: number;
    subscriptions: number;
    active_subscriptions: number;
  }>;
}

/**
 * Polar Integration Client Interface
 * Provides type-safe methods for all Polar operations
 */
export interface PolarIntegrationClient {
  // ── Products ──────────────────────────────────────────────

  /**
   * List products
   */
  listProducts(params?: {
    /** Organization ID */
    organization_id?: string;
    /** Include archived products */
    is_archived?: boolean;
    /** Number of products to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get product details
   */
  getProduct(params: {
    /** Product ID */
    product_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new product
   */
  createProduct(params: {
    /** Product name */
    name: string;
    /** Product description */
    description?: string;
    /** Prices as JSON array string (e.g. '[{"amount": 1000, "currency": "usd"}]') */
    prices?: string;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a product
   */
  updateProduct(params: {
    /** Product ID */
    product_id: string;
    /** Updated name */
    name?: string;
    /** Updated description */
    description?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Subscriptions ─────────────────────────────────────────

  /**
   * List subscriptions
   */
  listSubscriptions(params?: {
    /** Organization ID */
    organization_id?: string;
    /** Product ID */
    product_id?: string;
    /** Filter by status */
    status?: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    /** Number of subscriptions to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get subscription details
   */
  getSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a subscription
   */
  updateSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
    /** New product price ID to switch to */
    product_price_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Revoke a subscription
   */
  revokeSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Customers ─────────────────────────────────────────────

  /**
   * List customers
   */
  listCustomers(params?: {
    /** Organization ID */
    organization_id?: string;
    /** Filter by email */
    email?: string;
    /** Number of customers to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get customer details
   */
  getCustomer(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new customer
   */
  createCustomer(params: {
    /** Customer email */
    email: string;
    /** Customer name */
    name?: string;
    /** Metadata as JSON object string */
    metadata?: string;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a customer
   */
  updateCustomer(params: {
    /** Customer ID */
    customer_id: string;
    /** Updated name */
    name?: string;
    /** Updated email */
    email?: string;
    /** Metadata as JSON object string */
    metadata?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a customer
   */
  deleteCustomer(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get customer state (subscriptions, orders, etc.)
   */
  getCustomerState(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Orders ────────────────────────────────────────────────

  /**
   * List orders
   */
  listOrders(params?: {
    /** Organization ID */
    organization_id?: string;
    /** Product ID */
    product_id?: string;
    /** Customer ID */
    customer_id?: string;
    /** Number of orders to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get order details
   */
  getOrder(params: {
    /** Order ID */
    order_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get order invoice
   */
  getOrderInvoice(params: {
    /** Order ID */
    order_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Benefits ──────────────────────────────────────────────

  /**
   * List benefits
   */
  listBenefits(params?: {
    /** Organization ID */
    organization_id?: string;
    /** Filter by type */
    type?: "custom" | "articles" | "discord" | "github_repository" | "downloadables" | "license_keys";
    /** Number of benefits to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get benefit details
   */
  getBenefit(params: {
    /** Benefit ID */
    benefit_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new benefit
   */
  createBenefit(params: {
    /** Benefit type */
    type: string;
    /** Benefit description */
    description: string;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a benefit
   */
  updateBenefit(params: {
    /** Benefit ID */
    benefit_id: string;
    /** Updated description */
    description?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Discounts ─────────────────────────────────────────────

  /**
   * List discounts
   */
  listDiscounts(params?: {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get discount details
   */
  getDiscount(params: {
    /** Discount ID */
    discount_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new discount
   */
  createDiscount(params: {
    /** Discount name */
    name: string;
    /** Discount type */
    type: "percentage" | "fixed";
    /** Discount amount (percentage 0-100 or fixed in cents) */
    amount?: number;
    /** Discount code */
    code?: string;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a discount
   */
  deleteDiscount(params: {
    /** Discount ID */
    discount_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Checkout Links ────────────────────────────────────────

  /**
   * List checkout links
   */
  listCheckoutLinks(params?: {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get checkout link details
   */
  getCheckoutLink(params: {
    /** Checkout link ID */
    checkout_link_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new checkout link
   */
  createCheckoutLink(params: {
    /** Product price ID */
    product_price_id: string;
    /** URL to redirect to after successful checkout */
    success_url?: string;
  }): Promise<MCPToolCallResponse>;

  // ── License Keys ──────────────────────────────────────────

  /**
   * List license keys
   */
  listLicenseKeys(params?: {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get license key details
   */
  getLicenseKey(params: {
    /** License key ID */
    license_key_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Validate a license key
   */
  validateLicenseKey(params: {
    /** License key ID */
    license_key_id: string;
    /** Validation conditions as JSON string */
    conditions?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Activate a license key
   */
  activateLicenseKey(params: {
    /** License key ID */
    license_key_id: string;
    /** Device/instance label */
    label: string;
  }): Promise<MCPToolCallResponse>;

  // ── Metrics ───────────────────────────────────────────────

  /**
   * Get metrics for a time period
   */
  getMetrics(params: {
    /** Start date (YYYY-MM-DD) */
    start_date: string;
    /** End date (YYYY-MM-DD) */
    end_date: string;
    /** Aggregation interval */
    interval?: "day" | "week" | "month";
    /** Organization ID */
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Organizations ─────────────────────────────────────────

  /**
   * List organizations
   */
  listOrganizations(params?: {
    /** Number to return */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get organization details
   */
  getOrganization(params: {
    /** Organization ID */
    organization_id: string;
  }): Promise<MCPToolCallResponse>;
}
