import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface OnenoteIntegrationClient {
  listNotebooks(params: {
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  getNotebook(params: {
    "notebook_id": string;
  }): Promise<MCPToolCallResponse>;
  listSections(params: {
    "notebook_id": string;
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  createSection(params: {
    "notebook_id": string;
    "section_json": string;
  }): Promise<MCPToolCallResponse>;
  listPages(params: {
    "section_id": string;
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  getPage(params: {
    "page_id": string;
  }): Promise<MCPToolCallResponse>;
}
