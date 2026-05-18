import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ContentfulIntegrationClient {
  listSpaces(params: { "limit"?: number; "skip"?: number }): Promise<MCPToolCallResponse>;
  getSpace(params: { space_id: string }): Promise<MCPToolCallResponse>;
  listEntries(params: { space_id: string; environment_id: string; "content_type"?: string; "limit"?: number; "skip"?: number }): Promise<MCPToolCallResponse>;
  getEntry(params: { space_id: string; environment_id: string; entry_id: string }): Promise<MCPToolCallResponse>;
  createEntry(params: { space_id: string; environment_id: string; entry_json: string }): Promise<MCPToolCallResponse>;
  publishEntry(params: { space_id: string; environment_id: string; entry_id: string }): Promise<MCPToolCallResponse>;
}
