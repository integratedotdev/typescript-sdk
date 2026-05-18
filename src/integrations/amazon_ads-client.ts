import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AmazonAdsIntegrationClient {
  listProfiles(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listCampaigns(params: { "stateFilter"?: string; "campaignType"?: string }): Promise<MCPToolCallResponse>;
  createCampaigns(params: { campaigns_json: string }): Promise<MCPToolCallResponse>;
  listAdGroups(params: { "campaignIdFilter"?: string; "stateFilter"?: string }): Promise<MCPToolCallResponse>;
  listKeywords(params: { "campaignIdFilter"?: string; "adGroupIdFilter"?: string }): Promise<MCPToolCallResponse>;
  requestReport(params: { report_json: string }): Promise<MCPToolCallResponse>;
}
