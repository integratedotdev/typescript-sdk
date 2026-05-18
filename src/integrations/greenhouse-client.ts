import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GreenhouseIntegrationClient {
  listCandidates(params: { "per_page"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
  getCandidate(params: { candidate_id: string }): Promise<MCPToolCallResponse>;
  createCandidate(params: { candidate_json: string }): Promise<MCPToolCallResponse>;
  listJobs(params: { "per_page"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
  listApplications(params: { "per_page"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
  listUsers(params: { "per_page"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
}
