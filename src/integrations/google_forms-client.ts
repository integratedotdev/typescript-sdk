import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleFormsIntegrationClient {
  createForm(params: {
    "form_json": string;
  }): Promise<MCPToolCallResponse>;
  getForm(params: {
    "form_id": string;
  }): Promise<MCPToolCallResponse>;
  batchUpdateForm(params: {
    "form_id": string;
    "requests_json": string;
  }): Promise<MCPToolCallResponse>;
  listFormResponses(params: {
    "form_id": string;
    "pageSize"?: number;
    "pageToken"?: string;
    "filter"?: string;
  }): Promise<MCPToolCallResponse>;
  getFormResponse(params: {
    "form_id": string;
    "response_id": string;
  }): Promise<MCPToolCallResponse>;
}
