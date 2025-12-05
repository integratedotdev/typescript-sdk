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
 * HubSpot Integration Client Interface
 * Provides type-safe methods for all HubSpot operations
 */
export interface HubSpotIntegrationClient {
  /**
   * List contacts
   * 
   * @example
   * ```typescript
   * const contacts = await client.hubspot.listContacts({
   *   limit: 50,
   *   properties: ["email", "firstname", "lastname"]
   * });
   * ```
   */
  listContacts(params?: {
    /** Maximum number of results */
    limit?: number;
    /** Pagination cursor */
    after?: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get contact details
   * 
   * @example
   * ```typescript
   * const contact = await client.hubspot.getContact({
   *   contact_id: "123456"
   * });
   * ```
   */
  getContact(params: {
    /** Contact ID */
    contact_id: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new contact
   * 
   * @example
   * ```typescript
   * const contact = await client.hubspot.createContact({
   *   properties: {
   *     email: "user@example.com",
   *     firstname: "John",
   *     lastname: "Doe"
   *   }
   * });
   * ```
   */
  createContact(params: {
    /** Contact properties */
    properties: {
      email?: string;
      firstname?: string;
      lastname?: string;
      phone?: string;
      company?: string;
      website?: string;
      lifecyclestage?: string;
      [key: string]: any;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a contact
   * 
   * @example
   * ```typescript
   * await client.hubspot.updateContact({
   *   contact_id: "123456",
   *   properties: {
   *     phone: "+1234567890"
   *   }
   * });
   * ```
   */
  updateContact(params: {
    /** Contact ID */
    contact_id: string;
    /** Properties to update */
    properties: {
      email?: string;
      firstname?: string;
      lastname?: string;
      phone?: string;
      company?: string;
      website?: string;
      lifecyclestage?: string;
      [key: string]: any;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * List companies
   * 
   * @example
   * ```typescript
   * const companies = await client.hubspot.listCompanies({
   *   limit: 50,
   *   properties: ["name", "domain"]
   * });
   * ```
   */
  listCompanies(params?: {
    /** Maximum number of results */
    limit?: number;
    /** Pagination cursor */
    after?: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get company details
   * 
   * @example
   * ```typescript
   * const company = await client.hubspot.getCompany({
   *   company_id: "123456"
   * });
   * ```
   */
  getCompany(params: {
    /** Company ID */
    company_id: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new company
   * 
   * @example
   * ```typescript
   * const company = await client.hubspot.createCompany({
   *   properties: {
   *     name: "Acme Corp",
   *     domain: "acme.com"
   *   }
   * });
   * ```
   */
  createCompany(params: {
    /** Company properties */
    properties: {
      name?: string;
      domain?: string;
      phone?: string;
      city?: string;
      state?: string;
      country?: string;
      industry?: string;
      numberofemployees?: string;
      annualrevenue?: string;
      [key: string]: any;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * List deals
   * 
   * @example
   * ```typescript
   * const deals = await client.hubspot.listDeals({
   *   limit: 50,
   *   properties: ["dealname", "amount", "dealstage"]
   * });
   * ```
   */
  listDeals(params?: {
    /** Maximum number of results */
    limit?: number;
    /** Pagination cursor */
    after?: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get deal details
   * 
   * @example
   * ```typescript
   * const deal = await client.hubspot.getDeal({
   *   deal_id: "123456"
   * });
   * ```
   */
  getDeal(params: {
    /** Deal ID */
    deal_id: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new deal
   * 
   * @example
   * ```typescript
   * const deal = await client.hubspot.createDeal({
   *   properties: {
   *     dealname: "New Deal",
   *     amount: "10000",
   *     dealstage: "appointmentscheduled"
   *   }
   * });
   * ```
   */
  createDeal(params: {
    /** Deal properties */
    properties: {
      dealname?: string;
      dealstage?: string;
      pipeline?: string;
      amount?: string;
      closedate?: string;
      dealtype?: string;
      description?: string;
      [key: string]: any;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * List support tickets
   * 
   * @example
   * ```typescript
   * const tickets = await client.hubspot.listTickets({
   *   limit: 50,
   *   properties: ["subject", "content", "hs_pipeline_stage"]
   * });
   * ```
   */
  listTickets(params?: {
    /** Maximum number of results */
    limit?: number;
    /** Pagination cursor */
    after?: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get ticket details
   * 
   * @example
   * ```typescript
   * const ticket = await client.hubspot.getTicket({
   *   ticket_id: "123456"
   * });
   * ```
   */
  getTicket(params: {
    /** Ticket ID */
    ticket_id: string;
    /** Properties to return */
    properties?: string[];
    /** Associations to include */
    associations?: string[];
  }): Promise<MCPToolCallResponse>;
}
