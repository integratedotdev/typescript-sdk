import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface KlaviyoIntegrationClient {
  listAccounts(params: {
    "page[size]"?: number;
  }): Promise<MCPToolCallResponse>;
  listProfiles(params: {
    "page[size]"?: number;
    "filter"?: string;
  }): Promise<MCPToolCallResponse>;
  getProfile(params: {
    "profile_id": string;
  }): Promise<MCPToolCallResponse>;
  createProfile(params: {
    "profile_json": string;
  }): Promise<MCPToolCallResponse>;
  listLists(params: {
    "page[size]"?: number;
    "filter"?: string;
  }): Promise<MCPToolCallResponse>;
  listCampaigns(params: {
    "page[size]"?: number;
    "filter"?: string;
  }): Promise<MCPToolCallResponse>;
  createCampaign(params: {
    "campaign_json": string;
  }): Promise<MCPToolCallResponse>;
  listMetrics(params: {
    "page[size]"?: number;
  }): Promise<MCPToolCallResponse>;
}
