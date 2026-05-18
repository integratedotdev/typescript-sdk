import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PandadocIntegrationClient {
  listDocuments(params: { "q"?: string; "status"?: string; "count"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
  getDocument(params: { document_id: string }): Promise<MCPToolCallResponse>;
  createDocument(params: { document_json: string }): Promise<MCPToolCallResponse>;
  sendDocument(params: { document_id: string; send_json: string }): Promise<MCPToolCallResponse>;
  listTemplates(params: { "q"?: string; "count"?: number; "page"?: number }): Promise<MCPToolCallResponse>;
  createSession(params: { document_id: string; session_json: string }): Promise<MCPToolCallResponse>;
}
