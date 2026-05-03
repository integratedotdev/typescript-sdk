import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ThreadsIntegrationClient {
  getMe(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listUserMedia(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getMedia(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  keywordSearch(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createMediaContainer(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  publishMediaContainer(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getContainerStatus(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listReplies(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getConversation(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  manageReply(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  repost(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  deleteMedia(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
