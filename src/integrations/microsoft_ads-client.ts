import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MicrosoftAdsIntegrationClient {
  getUser(params: { query_json: string }): Promise<MCPToolCallResponse>;
  searchAccounts(params: { search_json: string }): Promise<MCPToolCallResponse>;
  getCampaigns(params: { campaigns_json: string }): Promise<MCPToolCallResponse>;
  addCampaigns(params: { campaigns_json: string }): Promise<MCPToolCallResponse>;
  getAdGroups(params: { adgroups_json: string }): Promise<MCPToolCallResponse>;
  getKeywords(params: { keywords_json: string }): Promise<MCPToolCallResponse>;
}
