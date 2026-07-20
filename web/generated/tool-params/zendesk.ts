/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZendeskListTicketsParams {
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
  }

export interface ZendeskGetTicketParams {
    /** Ticket ID */
    ticket_id: number;
  }

export interface ZendeskCreateTicketParams {
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
  }

export interface ZendeskUpdateTicketParams {
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
  }

export interface ZendeskAddCommentParams {
    /** Ticket ID to comment on */
    ticket_id: number;
    /** Comment body */
    body: string;
    /** Whether the comment is public (visible to requester) */
    public?: boolean;
    /** Author ID (defaults to authenticated user) */
    author_id?: number;
  }

export interface ZendeskListUsersParams {
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
  }

export interface ZendeskGetUserParams {
    /** User ID */
    user_id: number;
  }

export interface ZendeskSearchTicketsParams {
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
  }

export interface ZendeskListOrganizationsParams {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskDeleteTicketParams {
    /** Ticket ID to delete */
    ticket_id: number;
  }

export interface ZendeskListTicketCommentsParams {
    /** Ticket ID */
    ticket_id: number;
    /** Sort order */
    sort_order?: "asc" | "desc";
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskCreateUserParams {
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
  }

export interface ZendeskUpdateUserParams {
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
  }

export interface ZendeskSearchUsersParams {
    /** Search query */
    query: string;
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskGetOrganizationParams {
    /** Organization ID */
    organization_id: number;
  }

export interface ZendeskCreateOrganizationParams {
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
  }

export interface ZendeskUpdateOrganizationParams {
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
  }

export interface ZendeskListGroupsParams {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskGetGroupParams {
    /** Group ID */
    group_id: number;
  }

export interface ZendeskSearchParams {
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
  }

export interface ZendeskListViewsParams {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskGetViewTicketsParams {
    /** View ID */
    view_id: number;
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskListMacrosParams {
    /** Page number */
    page?: number;
    /** Results per page */
    per_page?: number;
  }

export interface ZendeskAddTagsParams {
    /** Ticket ID */
    ticket_id: number;
    /** Tags to add */
    tags: string[];
  }

export interface ZendeskRemoveTagsParams {
    /** Ticket ID */
    ticket_id: number;
    /** Tags to remove */
    tags: string[];
  }

