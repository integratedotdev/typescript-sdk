import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ConfluenceIntegrationClient {
  listAccessibleResources(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listSpaces(params: { cloud_id: string; limit?: number; cursor?: string; keys?: string; type?: string; status?: string }): Promise<MCPToolCallResponse>;
  getSpace(params: { cloud_id: string; space_id: string }): Promise<MCPToolCallResponse>;
  listPages(params: { cloud_id: string; space_id?: string; status?: string; title?: string; limit?: number; cursor?: string }): Promise<MCPToolCallResponse>;
  getPage(params: { cloud_id: string; page_id: string; "body-format"?: string }): Promise<MCPToolCallResponse>;
  createPage(params: { cloud_id: string; page_json: string }): Promise<MCPToolCallResponse>;
  updatePage(params: { cloud_id: string; page_id: string; page_json: string }): Promise<MCPToolCallResponse>;
  deletePage(params: { cloud_id: string; page_id: string }): Promise<MCPToolCallResponse>;
  search(params: { cloud_id: string; cql: string; limit?: number; start?: number; expand?: string }): Promise<MCPToolCallResponse>;
  listComments(params: { cloud_id: string; page_id: string; limit?: number; cursor?: string; "body-format"?: string }): Promise<MCPToolCallResponse>;
  createComment(params: { cloud_id: string; comment_json: string }): Promise<MCPToolCallResponse>;
  listAttachments(params: { cloud_id: string; page_id: string; limit?: number; cursor?: string; mediaType?: string; filename?: string }): Promise<MCPToolCallResponse>;
}

