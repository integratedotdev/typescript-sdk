import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface LeverIntegrationClient {
  listOpportunities(params: { "limit"?: number; "offset"?: number; "stage_id"?: string }): Promise<MCPToolCallResponse>;
  getOpportunity(params: { opportunity_id: string }): Promise<MCPToolCallResponse>;
  createOpportunity(params: { opportunity_json: string }): Promise<MCPToolCallResponse>;
  listPostings(params: { "limit"?: number; "offset"?: number; "state"?: string }): Promise<MCPToolCallResponse>;
  listUsers(params: { "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  listStages(params: Record<string, never>): Promise<MCPToolCallResponse>;
}
