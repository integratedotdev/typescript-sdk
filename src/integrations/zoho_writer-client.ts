import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoWriterIntegrationClient {
  listDocuments(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  getDocument(params: {
    "document_id": string;
  }): Promise<MCPToolCallResponse>;
  createDocument(params: {
    "document_json": string;
  }): Promise<MCPToolCallResponse>;
  listTemplates(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  mergeDocument(params: {
    "document_id": string;
    "merge_json": string;
  }): Promise<MCPToolCallResponse>;
  exportDocument(params: {
    "document_id": string;
    "format"?: string;
  }): Promise<MCPToolCallResponse>;
}
