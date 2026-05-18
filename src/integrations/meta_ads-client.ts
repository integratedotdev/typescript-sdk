import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MetaAdsIntegrationClient {
  listAdAccounts(params: { "fields"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  getAdAccount(params: { ad_account_id: string; "fields"?: string }): Promise<MCPToolCallResponse>;
  listCampaigns(params: { ad_account_id: string; "fields"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  createCampaign(params: { ad_account_id: string; campaign_json: string }): Promise<MCPToolCallResponse>;
  listAdsets(params: { ad_account_id: string; "fields"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  listAds(params: { ad_account_id: string; "fields"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
}
