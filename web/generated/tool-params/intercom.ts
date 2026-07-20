/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface IntercomListContactsParams {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }

export interface IntercomGetContactParams {
    /** Contact ID */
    contact_id: string;
  }

export interface IntercomCreateContactParams {
    /** Contact role */
    role?: "user" | "lead";
    /** External ID */
    external_id?: string;
    /** Email address */
    email?: string;
    /** Phone number */
    phone?: string;
    /** Name */
    name?: string;
    /** Avatar URL */
    avatar?: string;
    /** Signed up timestamp */
    signed_up_at?: number;
    /** Last seen timestamp */
    last_seen_at?: number;
    /** Owner ID */
    owner_id?: number;
    /** Unsubscribe from emails */
    unsubscribed_from_emails?: boolean;
    /** Custom attributes */
    custom_attributes?: Record<string, any>;
  }

export interface IntercomListConversationsParams {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }

export interface IntercomGetConversationParams {
    /** Conversation ID */
    conversation_id: string;
  }

export interface IntercomReplyConversationParams {
    /** Conversation ID */
    conversation_id: string;
    /** Message type */
    message_type: "comment" | "note";
    /** Reply body */
    body: string;
    /** Admin ID (for assignment) */
    admin_id?: string;
    /** Attachment URLs */
    attachment_urls?: string[];
  }

export interface IntercomListCompaniesParams {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }

export interface IntercomGetCompanyParams {
    /** Company ID */
    company_id: string;
  }

export interface IntercomSearchContactsParams {
    /** Search query */
    query: {
      /** Field to search */
      field: string;
      /** Operator */
      operator: "=" | "!=" | "IN" | "NIN" | ">" | "<" | "~";
      /** Value */
      value: string | number | boolean | string[];
    };
    /** Pagination */
    pagination?: {
      /** Number of results per page */
      per_page?: number;
      /** Starting after cursor */
      starting_after?: string;
    };
  }

