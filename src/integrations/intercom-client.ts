/**
 * Intercom Integration Client Types
 * Fully typed interface for Intercom integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Intercom Contact
 */
export interface IntercomContact {
  type: "contact";
  id: string;
  workspace_id: string;
  external_id?: string;
  role: "user" | "lead";
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  owner_id?: number;
  social_profiles?: {
    type: string;
    name: string;
    username?: string;
    url?: string;
  }[];
  has_hard_bounced: boolean;
  marked_email_as_spam: boolean;
  unsubscribed_from_emails: boolean;
  created_at: number;
  updated_at: number;
  signed_up_at?: number;
  last_seen_at?: number;
  last_replied_at?: number;
  last_contacted_at?: number;
  last_email_opened_at?: number;
  last_email_clicked_at?: number;
  language_override?: string;
  browser?: string;
  browser_version?: string;
  browser_language?: string;
  os?: string;
  location?: {
    type: string;
    country?: string;
    region?: string;
    city?: string;
  };
  android_app_name?: string;
  android_app_version?: string;
  android_device?: string;
  android_os_version?: string;
  android_sdk_version?: string;
  android_last_seen_at?: number;
  ios_app_name?: string;
  ios_app_version?: string;
  ios_device?: string;
  ios_os_version?: string;
  ios_sdk_version?: string;
  ios_last_seen_at?: number;
  custom_attributes?: Record<string, any>;
  tags?: {
    type: string;
    data: Array<{
      type: string;
      id: string;
      url: string;
    }>;
  };
  notes?: {
    type: string;
    data: Array<{
      type: string;
      id: string;
      url: string;
    }>;
  };
  companies?: {
    type: string;
    data: Array<{
      type: string;
      id: string;
      url: string;
    }>;
  };
}

/**
 * Intercom Conversation
 */
export interface IntercomConversation {
  type: "conversation";
  id: string;
  created_at: number;
  updated_at: number;
  waiting_since?: number;
  snoozed_until?: number;
  source: {
    type: string;
    id: string;
    delivered_as: string;
    subject?: string;
    body?: string;
    author: {
      type: string;
      id: string;
      name?: string;
      email?: string;
    };
    attachments?: any[];
    url?: string;
  };
  contacts?: {
    type: string;
    contacts: Array<{
      type: string;
      id: string;
    }>;
  };
  teammates?: {
    type: string;
    teammates: Array<{
      type: string;
      id: string;
    }>;
  };
  admin_assignee_id?: number;
  team_assignee_id?: number;
  title?: string;
  state: "open" | "closed" | "snoozed";
  read: boolean;
  tags?: {
    type: string;
    tags: Array<{
      type: string;
      id: string;
      name: string;
    }>;
  };
  priority: "priority" | "not_priority";
  sla_applied?: {
    type: string;
    sla_name: string;
    sla_status: string;
  };
  conversation_rating?: {
    rating?: number;
    remark?: string;
    created_at?: number;
    contact?: {
      type: string;
      id: string;
    };
    teammate?: {
      type: string;
      id: string;
    };
  };
  statistics?: {
    type: string;
    time_to_assignment?: number;
    time_to_admin_reply?: number;
    time_to_first_close?: number;
    time_to_last_close?: number;
    median_time_to_reply?: number;
    first_contact_reply_at?: number;
    first_assignment_at?: number;
    first_admin_reply_at?: number;
    first_close_at?: number;
    last_assignment_at?: number;
    last_assignment_admin_reply_at?: number;
    last_contact_reply_at?: number;
    last_admin_reply_at?: number;
    last_close_at?: number;
    last_closed_by_id?: string;
    count_reopens?: number;
    count_assignments?: number;
    count_conversation_parts?: number;
  };
  conversation_parts?: {
    type: string;
    conversation_parts: Array<{
      type: string;
      id: string;
      part_type: string;
      body?: string;
      created_at: number;
      updated_at: number;
      notified_at?: number;
      author: {
        type: string;
        id: string;
        name?: string;
        email?: string;
      };
      attachments?: any[];
    }>;
    total_count: number;
  };
}

/**
 * Intercom Company
 */
export interface IntercomCompany {
  type: "company";
  id: string;
  name: string;
  company_id?: string;
  plan?: string;
  created_at: number;
  updated_at: number;
  monthly_spend?: number;
  session_count?: number;
  user_count?: number;
  size?: number;
  website?: string;
  industry?: string;
  custom_attributes?: Record<string, any>;
  tags?: {
    type: string;
    data: Array<{
      type: string;
      id: string;
      url: string;
    }>;
  };
}

/**
 * Intercom Integration Client Interface
 * Provides type-safe methods for all Intercom operations
 */
export interface IntercomIntegrationClient {
  /**
   * List contacts
   * 
   * @example
   * ```typescript
   * const contacts = await client.intercom.listContacts({
   *   per_page: 50
   * });
   * ```
   */
  listContacts(params?: {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get contact details
   * 
   * @example
   * ```typescript
   * const contact = await client.intercom.getContact({
   *   contact_id: "123456"
   * });
   * ```
   */
  getContact(params: {
    /** Contact ID */
    contact_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new contact
   * 
   * @example
   * ```typescript
   * const contact = await client.intercom.createContact({
   *   email: "user@example.com",
   *   name: "John Doe",
   *   role: "user"
   * });
   * ```
   */
  createContact(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List conversations
   * 
   * @example
   * ```typescript
   * const conversations = await client.intercom.listConversations({
   *   per_page: 20
   * });
   * ```
   */
  listConversations(params?: {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get conversation details
   * 
   * @example
   * ```typescript
   * const conversation = await client.intercom.getConversation({
   *   conversation_id: "123456"
   * });
   * ```
   */
  getConversation(params: {
    /** Conversation ID */
    conversation_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reply to a conversation
   * 
   * @example
   * ```typescript
   * await client.intercom.replyConversation({
   *   conversation_id: "123456",
   *   message_type: "comment",
   *   body: "Thanks for reaching out!"
   * });
   * ```
   */
  replyConversation(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List companies
   * 
   * @example
   * ```typescript
   * const companies = await client.intercom.listCompanies({
   *   per_page: 50
   * });
   * ```
   */
  listCompanies(params?: {
    /** Number of results per page */
    per_page?: number;
    /** Pagination cursor */
    starting_after?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get company details
   * 
   * @example
   * ```typescript
   * const company = await client.intercom.getCompany({
   *   company_id: "123456"
   * });
   * ```
   */
  getCompany(params: {
    /** Company ID */
    company_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for contacts
   * 
   * @example
   * ```typescript
   * const results = await client.intercom.searchContacts({
   *   query: {
   *     field: "email",
   *     operator: "=",
   *     value: "user@example.com"
   *   }
   * });
   * ```
   */
  searchContacts(params: {
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
  }): Promise<MCPToolCallResponse>;
}
