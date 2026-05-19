import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoRecruitIntegrationClient {
  listModules(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listCandidates(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  getCandidate(params: {
    "candidate_id": string;
  }): Promise<MCPToolCallResponse>;
  createCandidate(params: {
    "candidate_json": string;
  }): Promise<MCPToolCallResponse>;
  listJobOpenings(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  listInterviews(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
}
