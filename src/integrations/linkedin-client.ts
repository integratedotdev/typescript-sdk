import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface LinkedInIntegrationClient {
  getUserinfo(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  createPost(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
