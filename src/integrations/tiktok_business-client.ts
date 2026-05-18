import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TiktokBusinessIntegrationClient {
  listAdvertisers(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listCampaigns(params: { "advertiser_id"?: string; "page"?: number; "page_size"?: number }): Promise<MCPToolCallResponse>;
  createCampaign(params: { campaign_json: string }): Promise<MCPToolCallResponse>;
  listAdgroups(params: { "advertiser_id"?: string; "campaign_id"?: string; "page"?: number; "page_size"?: number }): Promise<MCPToolCallResponse>;
  listAds(params: { "advertiser_id"?: string; "adgroup_id"?: string; "page"?: number; "page_size"?: number }): Promise<MCPToolCallResponse>;
  runReport(params: { "advertiser_id"?: string; "report_type"?: string; "dimensions"?: string; "metrics"?: string }): Promise<MCPToolCallResponse>;
}
