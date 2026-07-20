/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZohoCreatorListApplicationsParams {
    "account_owner": string;
  }

export interface ZohoCreatorListFormsParams {
    "account_owner": string;
    "app_link_name": string;
  }

export interface ZohoCreatorListReportsParams {
    "account_owner": string;
    "app_link_name": string;
  }

export interface ZohoCreatorListRecordsParams {
    "account_owner": string;
    "app_link_name": string;
    "report_link_name": string;
    "page"?: number;
    "limit"?: number;
  }

export interface ZohoCreatorCreateRecordParams {
    "account_owner": string;
    "app_link_name": string;
    "form_link_name": string;
    "record_json": string;
  }

export interface ZohoCreatorUpdateRecordParams {
    "account_owner": string;
    "app_link_name": string;
    "report_link_name": string;
    "record_id": string;
    "record_json": string;
  }

