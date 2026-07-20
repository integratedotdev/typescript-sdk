/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SalesforceQueryParams {
    q: string;
    instance_url?: string;
  }

export interface SalesforceGetLimitsParams { instance_url?: string }

export interface SalesforceDescribeGlobalParams { instance_url?: string }

export interface SalesforceSobjectDescribeParams {
    sobject_type: string;
    instance_url?: string;
  }

export interface SalesforceSobjectGetParams {
    sobject_type: string;
    record_id: string;
    fields?: string;
    instance_url?: string;
  }

export interface SalesforceSobjectCreateParams {
    sobject_type: string;
    fields: Record<string, unknown>;
    instance_url?: string;
  }

export interface SalesforceSobjectUpdateParams {
    sobject_type: string;
    record_id: string;
    fields: Record<string, unknown>;
    instance_url?: string;
  }

export interface SalesforceSobjectDeleteParams {
    sobject_type: string;
    record_id: string;
    instance_url?: string;
  }

