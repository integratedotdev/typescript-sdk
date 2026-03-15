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
 * Zendesk Group
 */
export interface ZendeskGroup {
  id: number;
  url: string;
  name: string;
  description?: string;
  default: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Zendesk View
 */
export interface ZendeskView {
  id: number;
  url: string;
  title: string;
  active: boolean;
  description?: string;
  position: number;
  restriction?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Zendesk Macro
 */
export interface ZendeskMacro {
  id: number;
  url: string;
  title: string;
  active: boolean;
  description?: string;
  actions: Array<{
    field: string;
    value: unknown;
  }>;
  restriction?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Zendesk Tag
 */
export interface ZendeskTag {
  name: string;
  count: number;
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
    /** Requester email (alternative to requester_id) */
    requester_email?: string;
    /** Requester name (used with requester_email) */
    requester_name?: string;
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

  /**
   * Delete a ticket
   *
   * @example
   * ```typescript
   * await client.zendesk.deleteTicket({ ticket_id: 12345 });
   * ```
   */
  deleteTicket(params: {
    /** Ticket ID to delete */
    ticket_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List comments on a ticket
   *
   * @example
   * ```typescript
   * const comments = await client.zendesk.listTicketComments({
   *   ticket_id: 12345
   * });
   * ```
   */
  listTicketComments(params: {
    /** Ticket ID */
    ticket_id: number;
    /** Sort order */
    sort_order?: "asc" | "desc";
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new user
   *
   * @example
   * ```typescript
   * const user = await client.zendesk.createUser({
   *   name: "Jane Doe",
   *   email: "jane@example.com"
   * });
   * ```
   */
  createUser(params: {
    /** User name */
    name: string;
    /** User email */
    email: string;
    /** User role */
    role?: "end-user" | "agent" | "admin";
    /** Phone number */
    phone?: string;
    /** Organization ID */
    organization_id?: number;
    /** Tags */
    tags?: string[];
    /** Custom user fields */
    user_fields?: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing user
   *
   * @example
   * ```typescript
   * await client.zendesk.updateUser({
   *   user_id: 123456,
   *   name: "Jane Smith"
   * });
   * ```
   */
  updateUser(params: {
    /** User ID to update */
    user_id: number;
    /** New name */
    name?: string;
    /** New email */
    email?: string;
    /** New role */
    role?: "end-user" | "agent" | "admin";
    /** New phone number */
    phone?: string;
    /** New organization ID */
    organization_id?: number;
    /** New tags */
    tags?: string[];
    /** Whether the user is suspended */
    suspended?: boolean;
    /** Custom user fields */
    user_fields?: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for users
   *
   * @example
   * ```typescript
   * const results = await client.zendesk.searchUsers({
   *   query: "jane@example.com"
   * });
   * ```
   */
  searchUsers(params: {
    /** Search query */
    query: string;
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific organization
   *
   * @example
   * ```typescript
   * const org = await client.zendesk.getOrganization({
   *   organization_id: 789
   * });
   * ```
   */
  getOrganization(params: {
    /** Organization ID */
    organization_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new organization
   *
   * @example
   * ```typescript
   * const org = await client.zendesk.createOrganization({
   *   name: "Acme Corp"
   * });
   * ```
   */
  createOrganization(params: {
    /** Organization name */
    name: string;
    /** Details about the organization */
    details?: string;
    /** Notes about the organization */
    notes?: string;
    /** Domain names associated with this organization */
    domain_names?: string[];
    /** Default group ID */
    group_id?: number;
    /** Tags */
    tags?: string[];
    /** Custom organization fields */
    organization_fields?: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing organization
   *
   * @example
   * ```typescript
   * await client.zendesk.updateOrganization({
   *   organization_id: 789,
   *   name: "Acme Corporation"
   * });
   * ```
   */
  updateOrganization(params: {
    /** Organization ID to update */
    organization_id: number;
    /** New name */
    name?: string;
    /** New details */
    details?: string;
    /** New notes */
    notes?: string;
    /** New domain names */
    domain_names?: string[];
    /** New default group ID */
    group_id?: number;
    /** New tags */
    tags?: string[];
    /** Custom organization fields */
    organization_fields?: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;

  /**
   * List groups
   *
   * @example
   * ```typescript
   * const groups = await client.zendesk.listGroups();
   * ```
   */
  listGroups(params?: {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific group
   *
   * @example
   * ```typescript
   * const group = await client.zendesk.getGroup({ group_id: 456 });
   * ```
   */
  getGroup(params: {
    /** Group ID */
    group_id: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search across all Zendesk resources (tickets, users, organizations)
   *
   * @example
   * ```typescript
   * const results = await client.zendesk.search({
   *   query: "type:ticket status:open"
   * });
   * ```
   */
  search(params: {
    /** Search query (Zendesk search syntax) */
    query: string;
    /** Sort by field */
    sort_by?: string;
    /** Sort order */
    sort_order?: "asc" | "desc";
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List views
   *
   * @example
   * ```typescript
   * const views = await client.zendesk.listViews();
   * ```
   */
  listViews(params?: {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get tickets from a specific view
   *
   * @example
   * ```typescript
   * const tickets = await client.zendesk.getViewTickets({
   *   view_id: 123
   * });
   * ```
   */
  getViewTickets(params: {
    /** View ID */
    view_id: number;
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List macros
   *
   * @example
   * ```typescript
   * const macros = await client.zendesk.listMacros();
   * ```
   */
  listMacros(params?: {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List tags
   *
   * @example
   * ```typescript
   * const tags = await client.zendesk.listTags();
   * ```
   */
  listTags(): Promise<MCPToolCallResponse>;

  /**
   * Add tags to a ticket
   *
   * @example
   * ```typescript
   * await client.zendesk.addTags({
   *   ticket_id: 12345,
   *   tags: ["vip", "urgent"]
   * });
   * ```
   */
  addTags(params: {
    /** Ticket ID */
    ticket_id: number;
    /** Tags to add */
    tags: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Remove tags from a ticket
   *
   * @example
   * ```typescript
   * await client.zendesk.removeTags({
   *   ticket_id: 12345,
   *   tags: ["resolved"]
   * });
   * ```
   */
  removeTags(params: {
    /** Ticket ID */
    ticket_id: number;
    /** Tags to remove */
    tags: string[];
  }): Promise<MCPToolCallResponse>;
}

