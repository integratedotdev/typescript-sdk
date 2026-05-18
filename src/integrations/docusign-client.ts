import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DocusignIntegrationClient {
  getUserInfo(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listEnvelopes(params: { account_id: string; from_date?: string; status?: string; count?: number; start_position?: number; base_uri: string }): Promise<MCPToolCallResponse>;
  getEnvelope(params: { account_id: string; envelope_id: string; base_uri: string }): Promise<MCPToolCallResponse>;
  createEnvelope(params: { account_id: string; envelope_json: string; base_uri: string }): Promise<MCPToolCallResponse>;
  listRecipients(params: { account_id: string; envelope_id: string; base_uri: string }): Promise<MCPToolCallResponse>;
  getDocument(params: { account_id: string; envelope_id: string; document_id: string; base_uri: string }): Promise<MCPToolCallResponse>;
  listTemplates(params: { account_id: string; count?: number; start_position?: number; search_text?: string; base_uri: string }): Promise<MCPToolCallResponse>;
}
