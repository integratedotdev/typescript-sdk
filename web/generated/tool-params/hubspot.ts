/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface HubspotListContactsParams {
    limit?: number;
    after?: string;
  }

export interface HubspotGetContactParams {
    contact_id: string;
  }

export interface HubspotCreateContactParams {
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecyclestage?: string;
  }

export interface HubspotUpdateContactParams {
    contact_id: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecyclestage?: string;
  }

export interface HubspotDeleteContactParams {
    contact_id: string;
  }

export interface HubspotListCompaniesParams {
    limit?: number;
    after?: string;
  }

export interface HubspotGetCompanyParams {
    company_id: string;
  }

export interface HubspotCreateCompanyParams {
    name?: string;
    domain?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
  }

export interface HubspotUpdateCompanyParams {
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
  }

export interface HubspotDeleteCompanyParams {
    company_id: string;
  }

export interface HubspotListDealsParams {
    limit?: number;
    after?: string;
  }

export interface HubspotGetDealParams {
    deal_id: string;
  }

export interface HubspotCreateDealParams {
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    dealtype?: string;
    description?: string;
  }

export interface HubspotUpdateDealParams {
    deal_id: string;
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    dealtype?: string;
    description?: string;
  }

export interface HubspotDeleteDealParams {
    deal_id: string;
  }

export interface HubspotListTicketsParams {
    limit?: number;
    after?: string;
  }

export interface HubspotGetTicketParams {
    ticket_id: string;
  }

export interface HubspotCreateTicketParams {
    subject: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    hs_ticket_category?: string;
  }

export interface HubspotUpdateTicketParams {
    ticket_id: string;
    subject?: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    hs_ticket_category?: string;
  }

export interface HubspotDeleteTicketParams {
    ticket_id: string;
  }

export interface HubspotSearchCrmParams {
    object_type: string;
    query?: string;
    filter_property?: string;
    filter_operator?: string;
    filter_value?: string;
    limit?: number;
    after?: string;
  }

export interface HubspotCreateNoteParams {
    body: string;
    timestamp?: string;
    owner_id?: string;
    associated_object_type?: string;
    associated_object_id?: string;
  }

export interface HubspotCreateTaskParams {
    subject: string;
    due_date?: string;
    body?: string;
    status?: string;
    priority?: string;
    task_type?: string;
    owner_id?: string;
    associated_object_type?: string;
    associated_object_id?: string;
  }

export interface HubspotListOwnersParams {
    limit?: number;
    after?: string;
  }

export interface HubspotGetOwnerParams {
    owner_id: string;
  }

export interface HubspotListPipelinesParams {
    object_type: string;
  }

export interface HubspotListPipelineStagesParams {
    object_type: string;
    pipeline_id: string;
  }

export interface HubspotCreateAssociationParams {
    from_object_type: string;
    from_object_id: string;
    to_object_type: string;
    to_object_id: string;
    association_type_id: string;
  }

