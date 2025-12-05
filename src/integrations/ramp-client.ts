/**
 * Ramp Integration Client Types
 * Fully typed interface for Ramp integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Ramp Transaction
 */
export interface RampTransaction {
  id: string;
  amount: number;
  merchant_id?: string;
  merchant_name: string;
  merchant_descriptor?: string;
  merchant_category_code?: string;
  merchant_category_code_description?: string;
  card_id: string;
  user_id: string;
  state: "PENDING" | "SETTLED" | "DECLINED" | "CANCELED";
  memo?: string;
  sk_category_id?: string;
  sk_category_name?: string;
  receipts?: Array<{
    id: string;
    receipt_url: string;
    created_at: string;
  }>;
  card_holder: {
    id: string;
    first_name: string;
    last_name: string;
    department_id?: string;
  };
  merchant_category?: string;
  accounting_categories?: Array<{
    id: string;
    name: string;
  }>;
  disputes?: Array<{
    id: string;
    state: string;
    reason_code: string;
  }>;
  policy_violations?: Array<{
    id: string;
    memo: string;
  }>;
  line_items?: Array<{
    id: string;
    amount: number;
    accounting_category_id?: string;
  }>;
  created_at: string;
  user_transaction_time: string;
}

/**
 * Ramp Card
 */
export interface RampCard {
  id: string;
  last_four: string;
  cardholder_id: string;
  cardholder_name: string;
  display_name?: string;
  is_physical: boolean;
  spending_restrictions?: {
    amount: number;
    interval: "DAILY" | "MONTHLY" | "YEARLY" | "TOTAL";
    categories?: number[];
    blocked_categories?: number[];
    lock_date?: string;
  };
  fulfillment?: {
    card_personalization?: {
      text: {
        name_line_1: string;
      };
    };
    shipping?: {
      recipient_first_name?: string;
      recipient_last_name?: string;
      address: {
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    };
  };
  state: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
  has_chip: boolean;
  created_at: string;
}

/**
 * Ramp User
 */
export interface RampUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "CARD_HOLDER" | "BUSINESS_OWNER" | "BUSINESS_ADMIN" | "BOOKKEEPER";
  department_id?: string;
  direct_manager_id?: string;
  location_id?: string;
  phone?: string;
  manager_id?: string;
  is_manager?: boolean;
}

/**
 * Ramp Department
 */
export interface RampDepartment {
  id: string;
  name: string;
}

/**
 * Ramp Reimbursement
 */
export interface RampReimbursement {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  merchant: string;
  transaction_date: string;
  receipts: Array<{
    id: string;
    receipt_url: string;
    created_at: string;
  }>;
  memo?: string;
  created_at: string;
}

/**
 * Ramp Spend Limit
 */
export interface RampSpendLimit {
  id: string;
  display_name: string;
  amount: number;
  interval: "DAILY" | "MONTHLY" | "YEARLY" | "TOTAL";
  owner_id: string;
  owner_type: "USER" | "TEAM";
  temporary?: boolean;
  start_date?: string;
  end_date?: string;
  locked?: boolean;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  blocked_categories?: Array<{
    id: string;
    name: string;
  }>;
  transaction_amount_limit?: {
    amount: number;
  };
}

/**
 * Ramp Integration Client Interface
 * Provides type-safe methods for all Ramp operations
 */
export interface RampIntegrationClient {
  /**
   * List transactions
   * 
   * @example
   * ```typescript
   * const transactions = await client.ramp.listTransactions({
   *   from_date: "2024-01-01",
   *   to_date: "2024-01-31",
   *   page_size: 50
   * });
   * ```
   */
  listTransactions(params?: {
    /** Filter by start date (YYYY-MM-DD) */
    from_date?: string;
    /** Filter by end date (YYYY-MM-DD) */
    to_date?: string;
    /** Filter by card ID */
    card_id?: string;
    /** Filter by user ID */
    user_id?: string;
    /** Filter by state */
    state?: "PENDING" | "SETTLED" | "DECLINED" | "CANCELED";
    /** Number of transactions to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get transaction details
   * 
   * @example
   * ```typescript
   * const transaction = await client.ramp.getTransaction({
   *   transaction_id: "txn_123456"
   * });
   * ```
   */
  getTransaction(params: {
    /** Transaction ID */
    transaction_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List cards
   * 
   * @example
   * ```typescript
   * const cards = await client.ramp.listCards({
   *   state: "ACTIVE",
   *   page_size: 50
   * });
   * ```
   */
  listCards(params?: {
    /** Filter by card state */
    state?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
    /** Filter by cardholder ID */
    cardholder_id?: string;
    /** Number of cards to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get card details
   * 
   * @example
   * ```typescript
   * const card = await client.ramp.getCard({
   *   card_id: "card_123456"
   * });
   * ```
   */
  getCard(params: {
    /** Card ID */
    card_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List users
   * 
   * @example
   * ```typescript
   * const users = await client.ramp.listUsers({
   *   page_size: 50
   * });
   * ```
   */
  listUsers(params?: {
    /** Filter by role */
    role?: "CARD_HOLDER" | "BUSINESS_OWNER" | "BUSINESS_ADMIN" | "BOOKKEEPER";
    /** Filter by department ID */
    department_id?: string;
    /** Number of users to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get user details
   * 
   * @example
   * ```typescript
   * const user = await client.ramp.getUser({
   *   user_id: "user_123456"
   * });
   * ```
   */
  getUser(params: {
    /** User ID */
    user_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List departments
   * 
   * @example
   * ```typescript
   * const departments = await client.ramp.listDepartments({
   *   page_size: 50
   * });
   * ```
   */
  listDepartments(params?: {
    /** Number of departments to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List reimbursements
   * 
   * @example
   * ```typescript
   * const reimbursements = await client.ramp.listReimbursements({
   *   from_date: "2024-01-01",
   *   to_date: "2024-01-31",
   *   page_size: 50
   * });
   * ```
   */
  listReimbursements(params?: {
    /** Filter by start date (YYYY-MM-DD) */
    from_date?: string;
    /** Filter by end date (YYYY-MM-DD) */
    to_date?: string;
    /** Filter by user ID */
    user_id?: string;
    /** Number of reimbursements to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get spend limits
   * 
   * @example
   * ```typescript
   * const spendLimits = await client.ramp.getSpendLimits({
   *   owner_id: "user_123456",
   *   owner_type: "USER"
   * });
   * ```
   */
  getSpendLimits(params?: {
    /** Filter by owner ID */
    owner_id?: string;
    /** Filter by owner type */
    owner_type?: "USER" | "TEAM";
    /** Number of spend limits to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }): Promise<MCPToolCallResponse>;
}
