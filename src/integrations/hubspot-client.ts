/**
 * HubSpot Integration Client Types
 * Fully typed interface for HubSpot integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * HubSpot Contact
 */
export interface HubSpotContact {
  id: string;
  properties: {
    createdate: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecyclestage?: string;
    hs_object_id: string;
    lastmodifieddate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Company
 */
export interface HubSpotCompany {
  id: string;
  properties: {
    createdate: string;
    domain?: string;
    name?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
    hs_object_id: string;
    lastmodifieddate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Deal
 */
export interface HubSpotDeal {
  id: string;
  properties: {
    createdate: string;
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    dealtype?: string;
    description?: string;
    hs_object_id: string;
    lastmodifieddate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Ticket
 */
export interface HubSpotTicket {
  id: string;
  properties: {
    createdate: string;
    subject?: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    hs_ticket_category?: string;
    hs_object_id: string;
    lastmodifieddate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Owner
 */
export interface HubSpotOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Pipeline
 */
export interface HubSpotPipeline {
  id: string;
  label: string;
  displayOrder: number;
  stages: HubSpotPipelineStage[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Pipeline Stage
 */
export interface HubSpotPipelineStage {
  id: string;
  label: string;
  displayOrder: number;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Note
 */
export interface HubSpotNote {
  id: string;
  properties: {
    hs_note_body?: string;
    hs_timestamp?: string;
    hubspot_owner_id?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Task
 */
export interface HubSpotTask {
  id: string;
  properties: {
    hs_task_subject?: string;
    hs_task_body?: string;
    hs_task_status?: string;
    hs_task_priority?: string;
    hs_task_type?: string;
    hs_timestamp?: string;
    hubspot_owner_id?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * HubSpot Association
 */
export interface HubSpotAssociation {
  from: { id: string };
  to: { id: string };
  type: string;
}

/**
 * HubSpot Integration Client Interface
 * Provides type-safe methods for all HubSpot operations
 */
export interface HubSpotIntegrationClient {
  // ── Contacts ──

  listContacts(params?: {
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getContact(params: {
    contact_id: string;
  }): Promise<MCPToolCallResponse>;

  createContact(params: {
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecyclestage?: string;
  }): Promise<MCPToolCallResponse>;

  updateContact(params: {
    contact_id: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecyclestage?: string;
  }): Promise<MCPToolCallResponse>;

  deleteContact(params: {
    contact_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Companies ──

  listCompanies(params?: {
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getCompany(params: {
    company_id: string;
  }): Promise<MCPToolCallResponse>;

  createCompany(params: {
    name?: string;
    domain?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
  }): Promise<MCPToolCallResponse>;

  updateCompany(params: {
    company_id: string;
    name?: string;
    domain?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
  }): Promise<MCPToolCallResponse>;

  deleteCompany(params: {
    company_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Deals ──

  listDeals(params?: {
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getDeal(params: {
    deal_id: string;
  }): Promise<MCPToolCallResponse>;

  createDeal(params: {
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    dealtype?: string;
    description?: string;
  }): Promise<MCPToolCallResponse>;

  updateDeal(params: {
    deal_id: string;
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    dealtype?: string;
    description?: string;
  }): Promise<MCPToolCallResponse>;

  deleteDeal(params: {
    deal_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Tickets ──

  listTickets(params?: {
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getTicket(params: {
    ticket_id: string;
  }): Promise<MCPToolCallResponse>;

  createTicket(params: {
    subject: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    hs_ticket_category?: string;
  }): Promise<MCPToolCallResponse>;

  updateTicket(params: {
    ticket_id: string;
    subject?: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    hs_ticket_category?: string;
  }): Promise<MCPToolCallResponse>;

  deleteTicket(params: {
    ticket_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Search ──

  searchCrm(params: {
    object_type: string;
    query?: string;
    filter_property?: string;
    filter_operator?: string;
    filter_value?: string;
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Notes ──

  createNote(params: {
    body: string;
    timestamp?: string;
    owner_id?: string;
    associated_object_type?: string;
    associated_object_id?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Tasks ──

  createTask(params: {
    subject: string;
    due_date?: string;
    body?: string;
    status?: string;
    priority?: string;
    task_type?: string;
    owner_id?: string;
    associated_object_type?: string;
    associated_object_id?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Owners ──

  listOwners(params?: {
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getOwner(params: {
    owner_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Pipelines ──

  listPipelines(params: {
    object_type: string;
  }): Promise<MCPToolCallResponse>;

  listPipelineStages(params: {
    object_type: string;
    pipeline_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Associations ──

  createAssociation(params: {
    from_object_type: string;
    from_object_id: string;
    to_object_type: string;
    to_object_id: string;
    association_type_id: string;
  }): Promise<MCPToolCallResponse>;
}
