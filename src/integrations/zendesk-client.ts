/**
 * Zendesk Integration Client Types
 * Fully typed interface for Zendesk integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Zendesk Ticket
 */
export interface ZendeskTicket {
  id: number;
  url: string;
  external_id?: string;
  type?: "problem" | "incident" | "question" | "task";
  subject: string;
  raw_subject?: string;
  description: string;
  priority?: "urgent" | "high" | "normal" | "low";
  status: "new" | "open" | "pending" | "hold" | "solved" | "closed";
  recipient?: string;
  requester_id: number;
  submitter_id: number;
  assignee_id?: number;
  organization_id?: number;
  group_id?: number;
  collaborator_ids?: number[];
  follower_ids?: number[];
  email_cc_ids?: number[];
  forum_topic_id?: number;
  problem_id?: number;
  has_incidents: boolean;
  is_public: boolean;
  due_at?: string;
  tags: string[];
  custom_fields?: Array<{
    id: number;
    value: unknown;
  }>;
  satisfaction_rating?: {
    score: string;
    comment?: string;
  };
  sharing_agreement_ids?: number[];
  fields?: Array<{
    id: number;
    value: unknown;
  }>;
  followup_ids?: number[];
  brand_id?: number;
  allow_channelback: boolean;
  allow_attachments: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Zendesk User
 */
export interface ZendeskUser {
  id: number;
  url: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  time_zone?: string;
  iana_time_zone?: string;
  phone?: string;
  shared_phone_number?: boolean;
  photo?: {
    url: string;
    id: number;
    file_name: string;
    content_url: string;
    mapped_content_url: string;
    content_type: string;
    size: number;
    width: number;
    height: number;
    inline: boolean;
    thumbnails: Array<{
      url: string;
      id: number;
      file_name: string;
      content_url: string;
      mapped_content_url: string;
      content_type: string;
      size: number;
      width: number;
      height: number;
    }>;
  };
  locale_id: number;
  locale?: string;
  organization_id?: number;
  role: "end-user" | "agent" | "admin";
  verified: boolean;
  external_id?: string;
  tags?: string[];
  alias?: string;
  active: boolean;
  shared: boolean;
  shared_agent: boolean;
  last_login_at?: string;
  two_factor_auth_enabled?: boolean;
  signature?: string;
  details?: string;
  notes?: string;
  role_type?: number;
  custom_role_id?: number;
  moderator: boolean;
  ticket_restriction?: "organization" | "groups" | "assigned" | "requested";
  only_private_comments: boolean;
  restricted_agent: boolean;
  suspended: boolean;
  default_group_id?: number;
  report_csv: boolean;
  user_fields?: Record<string, unknown>;
}

/**
 * Zendesk Organization
 */
export interface ZendeskOrganization {
  id: number;
  url: string;
  name: string;
  shared_tickets: boolean;
  shared_comments: boolean;
  external_id?: string;
  created_at: string;
  updated_at: string;
  domain_names?: string[];
  details?: string;
  notes?: string;
  group_id?: number;
  tags?: string[];
  organization_fields?: Record<string, unknown>;
}

/**
 * Zendesk Comment
 */
export interface ZendeskComment {
  id: number;
  type: "Comment" | "VoiceComment";
  body: string;
  html_body?: string;
  plain_body?: string;
  public: boolean;
  author_id: number;
  attachments?: Array<{
    id: number;
    file_name: string;
    content_url: string;
    content_type: string;
    size: number;
    thumbnails?: Array<{
      id: number;
      file_name: string;
      content_url: string;
      content_type: string;
      size: number;
    }>;
  }>;
  via?: {
    channel: string;
    source?: {
      from?: Record<string, unknown>;
      to?: Record<string, unknown>;
      rel?: string;
    };
  };
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Zendesk Integration Client Interface
 * Provides type-safe methods for all Zendesk operations
 */
export interface ZendeskIntegrationClient {
  /**
   * List tickets
   * 
   * @example
   * ```typescript
   * const tickets = await client.zendesk.listTickets({
   *   status: "open"
   * });
   * ```
   */
  listTickets(params?: {
    /** Filter by status */
    status?: "new" | "open" | "pending" | "hold" | "solved" | "closed";
    /** Filter by assignee ID */
    assignee_id?: number;
    /** Filter by requester ID */
    requester_id?: number;
    /** Filter by organization ID */
    organization_id?: number;
    /** Sort by field */
    sort_by?: "created_at" | "updated_at" | "priority" | "status" | "ticket_type";
    /** Sort order */
    sort_order?: "asc" | "desc";
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific ticket
   * 
   * @example
   * ```typescript
   * const ticket = await client.zendesk.getTicket({
   *   ticket_id: 12345
   * });
   * ```
   */
  getTicket(params: {
    /** Ticket ID */
    ticket_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new ticket
   * 
   * @example
   * ```typescript
   * const ticket = await client.zendesk.createTicket({
   *   subject: "Help needed",
   *   description: "I need assistance with...",
   *   priority: "normal"
   * });
   * ```
   */
  createTicket(params: {
    /** Ticket subject */
    subject: string;
    /** Ticket description/first comment */
    description: string;
    /** Ticket type */
    type?: "problem" | "incident" | "question" | "task";
    /** Ticket priority */
    priority?: "urgent" | "high" | "normal" | "low";
    /** Ticket status */
    status?: "new" | "open" | "pending" | "hold" | "solved";
    /** Requester ID */
    requester_id?: number;
    /** Assignee ID */
    assignee_id?: number;
    /** Group ID */
    group_id?: number;
    /** Organization ID */
    organization_id?: number;
    /** Tags */
    tags?: string[];
    /** Custom fields */
    custom_fields?: Array<{
      id: number;
      value: unknown;
    }>;
    /** Due date (ISO 8601) */
    due_at?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing ticket
   * 
   * @example
   * ```typescript
   * await client.zendesk.updateTicket({
   *   ticket_id: 12345,
   *   status: "solved",
   *   priority: "low"
   * });
   * ```
   */
  updateTicket(params: {
    /** Ticket ID to update */
    ticket_id: number;
    /** New subject */
    subject?: string;
    /** New type */
    type?: "problem" | "incident" | "question" | "task";
    /** New priority */
    priority?: "urgent" | "high" | "normal" | "low";
    /** New status */
    status?: "new" | "open" | "pending" | "hold" | "solved";
    /** New assignee ID */
    assignee_id?: number;
    /** New group ID */
    group_id?: number;
    /** New tags */
    tags?: string[];
    /** Custom fields */
    custom_fields?: Array<{
      id: number;
      value: unknown;
    }>;
    /** New due date */
    due_at?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a comment to a ticket
   * 
   * @example
   * ```typescript
   * await client.zendesk.addComment({
   *   ticket_id: 12345,
   *   body: "Thanks for reaching out! Here's how to fix this...",
   *   public: true
   * });
   * ```
   */
  addComment(params: {
    /** Ticket ID to comment on */
    ticket_id: number;
    /** Comment body */
    body: string;
    /** Whether the comment is public (visible to requester) */
    public?: boolean;
    /** Author ID (defaults to authenticated user) */
    author_id?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List users
   * 
   * @example
   * ```typescript
   * const users = await client.zendesk.listUsers({
   *   role: "agent"
   * });
   * ```
   */
  listUsers(params?: {
    /** Filter by role */
    role?: "end-user" | "agent" | "admin";
    /** Filter by organization ID */
    organization_id?: number;
    /** Filter by group ID */
    group_id?: number;
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific user
   * 
   * @example
   * ```typescript
   * const user = await client.zendesk.getUser({
   *   user_id: 123456
   * });
   * ```
   */
  getUser(params: {
    /** User ID */
    user_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for tickets
   * 
   * @example
   * ```typescript
   * const results = await client.zendesk.searchTickets({
   *   query: "status:open priority:urgent"
   * });
   * ```
   */
  searchTickets(params: {
    /** Search query (Zendesk search syntax) */
    query: string;
    /** Sort by field */
    sort_by?: "created_at" | "updated_at" | "priority" | "status" | "ticket_type";
    /** Sort order */
    sort_order?: "asc" | "desc";
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List organizations
   * 
   * @example
   * ```typescript
   * const orgs = await client.zendesk.listOrganizations({
   *   per_page: 50
   * });
   * ```
   */
  listOrganizations(params?: {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;
}

