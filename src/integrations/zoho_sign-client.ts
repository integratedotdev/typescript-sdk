import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoSignIntegrationClient {
  listRequests(params: {
    "page"?: number;
    "per_page"?: number;
    "status"?: string;
  }): Promise<MCPToolCallResponse>;
  getRequest(params: {
    "request_id": string;
  }): Promise<MCPToolCallResponse>;
  createRequest(params: {
    "request_json": string;
  }): Promise<MCPToolCallResponse>;
  listTemplates(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  getTemplate(params: {
    "template_id": string;
  }): Promise<MCPToolCallResponse>;
  listContacts(params: {
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
}
