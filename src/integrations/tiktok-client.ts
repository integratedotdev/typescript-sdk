import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TikTokIntegrationClient {
  getUserInfo(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listVideos(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  queryVideos(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
