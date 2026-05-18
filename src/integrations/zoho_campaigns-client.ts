import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoCampaignsIntegrationClient {
  listMailingLists(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listContacts(params: { listkey?: string; fromindex?: number; range?: number }): Promise<MCPToolCallResponse>;
  addContact(params: { listkey?: string; contact_json: string }): Promise<MCPToolCallResponse>;
  listCampaigns(params: { fromindex?: number; range?: number }): Promise<MCPToolCallResponse>;
  getCampaignReport(params: { campaignkey?: string }): Promise<MCPToolCallResponse>;
  sendCampaign(params: { campaignkey?: string }): Promise<MCPToolCallResponse>;
}
