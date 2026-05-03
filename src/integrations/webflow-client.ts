/**
 * Webflow Integration Client Types
 * Typed interface for Webflow Data API tools exposed by the MCP server
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WebflowIntegrationClient {
  tokenIntrospect(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getAuthorizedUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listSites(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getSite(params: { site_id: string }): Promise<MCPToolCallResponse>;
  getSiteCustomDomains(params: { site_id: string }): Promise<MCPToolCallResponse>;
  publishSite(params: { site_id: string; body: string }): Promise<MCPToolCallResponse>;
  listSitePages(params: {
    site_id: string;
    locale_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
  listSiteCollections(params: { site_id: string }): Promise<MCPToolCallResponse>;
  getCollection(params: { collection_id: string }): Promise<MCPToolCallResponse>;
  listCollectionItems(params: {
    collection_id: string;
    cms_locale_id?: string;
    name?: string;
    slug?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
  listLiveCollectionItems(params: {
    collection_id: string;
    cms_locale_id?: string;
    name?: string;
    slug?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
  getCollectionItem(params: {
    collection_id: string;
    item_id: string;
    cms_locale_id?: string;
  }): Promise<MCPToolCallResponse>;
  createCollectionItems(params: { collection_id: string; body: string }): Promise<MCPToolCallResponse>;
  updateCollectionItems(params: { collection_id: string; body: string }): Promise<MCPToolCallResponse>;
  deleteCollectionItems(params: { collection_id: string; body: string }): Promise<MCPToolCallResponse>;
  publishCollectionItems(params: { collection_id: string; body: string }): Promise<MCPToolCallResponse>;
  listSiteForms(params: { site_id: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  listSiteWebhooks(params: { site_id: string }): Promise<MCPToolCallResponse>;
}
