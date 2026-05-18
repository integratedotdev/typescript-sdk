import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AdobeAcrobatSignIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listAgreements(params: { "cursor"?: string; "pageSize"?: number }): Promise<MCPToolCallResponse>;
  getAgreement(params: { agreement_id: string }): Promise<MCPToolCallResponse>;
  createAgreement(params: { agreement_json: string }): Promise<MCPToolCallResponse>;
  listLibraryDocuments(params: { "cursor"?: string; "pageSize"?: number }): Promise<MCPToolCallResponse>;
  getSigningUrls(params: { agreement_id: string }): Promise<MCPToolCallResponse>;
}
