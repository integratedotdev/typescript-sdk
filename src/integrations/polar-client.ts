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
 * Polar Integration Client Interface
 * Provides type-safe methods for all Polar operations
 */
export interface PolarIntegrationClient {
  /**
   * List products
   * 
   * @example
   * ```typescript
   * const products = await client.polar.listProducts({
   *   organization_id: "org_123",
   *   limit: 10
   * });
   * ```
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
   * 
   * @example
   * ```typescript
   * const product = await client.polar.getProduct({
   *   product_id: "prod_123"
   * });
   * ```
   */
  getProduct(params: {
    /** Product ID */
    product_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List subscriptions
   * 
   * @example
   * ```typescript
   * const subscriptions = await client.polar.listSubscriptions({
   *   organization_id: "org_123",
   *   status: "active",
   *   limit: 50
   * });
   * ```
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
   * 
   * @example
   * ```typescript
   * const subscription = await client.polar.getSubscription({
   *   subscription_id: "sub_123"
   * });
   * ```
   */
  getSubscription(params: {
    /** Subscription ID */
    subscription_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List customers
   * 
   * @example
   * ```typescript
   * const customers = await client.polar.listCustomers({
   *   organization_id: "org_123",
   *   limit: 50
   * });
   * ```
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
   * 
   * @example
   * ```typescript
   * const customer = await client.polar.getCustomer({
   *   customer_id: "cus_123"
   * });
   * ```
   */
  getCustomer(params: {
    /** Customer ID */
    customer_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List orders
   * 
   * @example
   * ```typescript
   * const orders = await client.polar.listOrders({
   *   organization_id: "org_123",
   *   limit: 50
   * });
   * ```
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
   * 
   * @example
   * ```typescript
   * const order = await client.polar.getOrder({
   *   order_id: "ord_123"
   * });
   * ```
   */
  getOrder(params: {
    /** Order ID */
    order_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List benefits
   * 
   * @example
   * ```typescript
   * const benefits = await client.polar.listBenefits({
   *   organization_id: "org_123",
   *   limit: 50
   * });
   * ```
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
}
