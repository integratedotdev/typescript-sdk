import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WordpressIntegrationClient {
  getSite(params: { site: string }): Promise<MCPToolCallResponse>;
  listPosts(params: { "number"?: number; "page"?: number; "type"?: string; "status"?: string; site: string }): Promise<MCPToolCallResponse>;
  getPost(params: { post_id: string; site: string }): Promise<MCPToolCallResponse>;
  createPost(params: { post_json: string; site: string }): Promise<MCPToolCallResponse>;
  updatePost(params: { post_id: string; post_json: string; site: string }): Promise<MCPToolCallResponse>;
  listMedia(params: { "number"?: number; "page"?: number; site: string }): Promise<MCPToolCallResponse>;
}
