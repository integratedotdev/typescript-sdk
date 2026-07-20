/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PolarListProductsParams {
    /** Organization ID */
    organization_id?: string;
    /** Include archived products */
    is_archived?: boolean;
    /** Number of products to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }

export interface PolarGetProductParams {
    /** Product ID */
    product_id: string;
  }

export interface PolarCreateProductParams {
    /** Product name */
    name: string;
    /** Product description */
    description?: string;
    /** Prices as JSON array string (e.g. '[{"amount": 1000, "currency": "usd"}]') */
    prices?: string;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarUpdateProductParams {
    /** Product ID */
    product_id: string;
    /** Updated name */
    name?: string;
    /** Updated description */
    description?: string;
  }

export interface PolarListSubscriptionsParams {
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
  }

export interface PolarGetSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
  }

export interface PolarUpdateSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
    /** New product price ID to switch to */
    product_price_id?: string;
  }

export interface PolarRevokeSubscriptionParams {
    /** Subscription ID */
    subscription_id: string;
  }

export interface PolarListCustomersParams {
    /** Organization ID */
    organization_id?: string;
    /** Filter by email */
    email?: string;
    /** Number of customers to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }

export interface PolarGetCustomerParams {
    /** Customer ID */
    customer_id: string;
  }

export interface PolarCreateCustomerParams {
    /** Customer email */
    email: string;
    /** Customer name */
    name?: string;
    /** Metadata as JSON object string */
    metadata?: string;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarUpdateCustomerParams {
    /** Customer ID */
    customer_id: string;
    /** Updated name */
    name?: string;
    /** Updated email */
    email?: string;
    /** Metadata as JSON object string */
    metadata?: string;
  }

export interface PolarDeleteCustomerParams {
    /** Customer ID */
    customer_id: string;
  }

export interface PolarGetCustomerStateParams {
    /** Customer ID */
    customer_id: string;
  }

export interface PolarListOrdersParams {
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
  }

export interface PolarGetOrderParams {
    /** Order ID */
    order_id: string;
  }

export interface PolarGetOrderInvoiceParams {
    /** Order ID */
    order_id: string;
  }

export interface PolarListBenefitsParams {
    /** Organization ID */
    organization_id?: string;
    /** Filter by type */
    type?: "custom" | "articles" | "discord" | "github_repository" | "downloadables" | "license_keys";
    /** Number of benefits to return */
    limit?: number;
    /** Pagination cursor */
    page?: number;
  }

export interface PolarGetBenefitParams {
    /** Benefit ID */
    benefit_id: string;
  }

export interface PolarCreateBenefitParams {
    /** Benefit type */
    type: string;
    /** Benefit description */
    description: string;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarUpdateBenefitParams {
    /** Benefit ID */
    benefit_id: string;
    /** Updated description */
    description?: string;
  }

export interface PolarListDiscountsParams {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarGetDiscountParams {
    /** Discount ID */
    discount_id: string;
  }

export interface PolarCreateDiscountParams {
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
  }

export interface PolarDeleteDiscountParams {
    /** Discount ID */
    discount_id: string;
  }

export interface PolarListCheckoutLinksParams {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarGetCheckoutLinkParams {
    /** Checkout link ID */
    checkout_link_id: string;
  }

export interface PolarCreateCheckoutLinkParams {
    /** Product price ID */
    product_price_id: string;
    /** URL to redirect to after successful checkout */
    success_url?: string;
  }

export interface PolarListLicenseKeysParams {
    /** Number to return */
    limit?: number;
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarGetLicenseKeyParams {
    /** License key ID */
    license_key_id: string;
  }

export interface PolarValidateLicenseKeyParams {
    /** License key ID */
    license_key_id: string;
    /** Validation conditions as JSON string */
    conditions?: string;
  }

export interface PolarActivateLicenseKeyParams {
    /** License key ID */
    license_key_id: string;
    /** Device/instance label */
    label: string;
  }

export interface PolarGetMetricsParams {
    /** Start date (YYYY-MM-DD) */
    start_date: string;
    /** End date (YYYY-MM-DD) */
    end_date: string;
    /** Aggregation interval */
    interval?: "day" | "week" | "month";
    /** Organization ID */
    organization_id?: string;
  }

export interface PolarListOrganizationsParams {
    /** Number to return */
    limit?: number;
  }

export interface PolarGetOrganizationParams {
    /** Organization ID */
    organization_id: string;
  }

