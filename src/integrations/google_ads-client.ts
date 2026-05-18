import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleAdsIntegrationClient {
  listAccessibleCustomers(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  search(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
  listCampaigns(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
  listAdGroups(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
  listAds(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
  listKeywords(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
  listConversions(params: { customer_id: string; query_json: string; login_customer_id?: string }): Promise<MCPToolCallResponse>;
}
