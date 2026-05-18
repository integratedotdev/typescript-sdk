import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DropboxSignIntegrationClient {
  getAccount(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listSignatureRequests(params: { "page"?: number; "page_size"?: number }): Promise<MCPToolCallResponse>;
  getSignatureRequest(params: { signature_request_id: string }): Promise<MCPToolCallResponse>;
  sendSignatureRequest(params: { request_json: string }): Promise<MCPToolCallResponse>;
  listTemplates(params: { "page"?: number; "page_size"?: number }): Promise<MCPToolCallResponse>;
  getTemplate(params: { template_id: string }): Promise<MCPToolCallResponse>;
}
