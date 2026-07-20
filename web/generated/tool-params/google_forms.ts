/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleFormsCreateFormParams {
    "form_json": string;
  }

export interface GoogleFormsGetFormParams {
    "form_id": string;
  }

export interface GoogleFormsBatchUpdateFormParams {
    "form_id": string;
    "requests_json": string;
  }

export interface GoogleFormsListFormResponsesParams {
    "form_id": string;
    "pageSize"?: number;
    "pageToken"?: string;
    "filter"?: string;
  }

export interface GoogleFormsGetFormResponseParams {
    "form_id": string;
    "response_id": string;
  }

