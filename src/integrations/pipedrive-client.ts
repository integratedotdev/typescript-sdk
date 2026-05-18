import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PipedriveIntegrationClient {
  listDeals(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listLeads(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listPersons(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listOrganizations(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listActivities(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listNotes(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listPipelines(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  listProducts(params: { start?: number; limit?: number; api_domain: string }): Promise<MCPToolCallResponse>;
  createDeal(params: { deal_json: string; api_domain: string }): Promise<MCPToolCallResponse>;
}
