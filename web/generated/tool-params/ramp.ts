/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface RampListTransactionsParams {
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
  }

export interface RampGetTransactionParams {
    /** Transaction ID */
    transaction_id: string;
  }

export interface RampListCardsParams {
    /** Filter by card state */
    state?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
    /** Filter by cardholder ID */
    cardholder_id?: string;
    /** Number of cards to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }

export interface RampGetCardParams {
    /** Card ID */
    card_id: string;
  }

export interface RampListUsersParams {
    /** Filter by role */
    role?: "CARD_HOLDER" | "BUSINESS_OWNER" | "BUSINESS_ADMIN" | "BOOKKEEPER";
    /** Filter by department ID */
    department_id?: string;
    /** Number of users to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }

export interface RampGetUserParams {
    /** User ID */
    user_id: string;
  }

export interface RampListDepartmentsParams {
    /** Number of departments to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }

export interface RampListReimbursementsParams {
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
  }

export interface RampGetSpendLimitsParams {
    /** Filter by owner ID */
    owner_id?: string;
    /** Filter by owner type */
    owner_type?: "USER" | "TEAM";
    /** Number of spend limits to return */
    page_size?: number;
    /** Pagination cursor */
    start?: string;
  }

