/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface KlaviyoListAccountsParams {
    "page[size]"?: number;
  }

export interface KlaviyoListProfilesParams {
    "page[size]"?: number;
    "filter"?: string;
  }

export interface KlaviyoGetProfileParams {
    "profile_id": string;
  }

export interface KlaviyoCreateProfileParams {
    "profile_json": string;
  }

export interface KlaviyoListListsParams {
    "page[size]"?: number;
    "filter"?: string;
  }

export interface KlaviyoListCampaignsParams {
    "page[size]"?: number;
    "filter"?: string;
  }

export interface KlaviyoCreateCampaignParams {
    "campaign_json": string;
  }

export interface KlaviyoListMetricsParams {
    "page[size]"?: number;
  }

