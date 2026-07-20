/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface WebflowGetSiteParams { site_id: string }

export interface WebflowGetSiteCustomDomainsParams { site_id: string }

export interface WebflowPublishSiteParams { site_id: string; body: string }

export interface WebflowListSitePagesParams {
    site_id: string;
    locale_id?: string;
    limit?: number;
    offset?: number;
  }

export interface WebflowListSiteCollectionsParams { site_id: string }

export interface WebflowGetCollectionParams { collection_id: string }

export interface WebflowListCollectionItemsParams {
    collection_id: string;
    cms_locale_id?: string;
    name?: string;
    slug?: string;
    limit?: number;
    offset?: number;
  }

export interface WebflowListLiveCollectionItemsParams {
    collection_id: string;
    cms_locale_id?: string;
    name?: string;
    slug?: string;
    limit?: number;
    offset?: number;
  }

export interface WebflowGetCollectionItemParams {
    collection_id: string;
    item_id: string;
    cms_locale_id?: string;
  }

export interface WebflowCreateCollectionItemsParams { collection_id: string; body: string }

export interface WebflowUpdateCollectionItemsParams { collection_id: string; body: string }

export interface WebflowDeleteCollectionItemsParams { collection_id: string; body: string }

export interface WebflowPublishCollectionItemsParams { collection_id: string; body: string }

export interface WebflowListSiteFormsParams { site_id: string; limit?: number; offset?: number }

export interface WebflowListSiteWebhooksParams { site_id: string }

