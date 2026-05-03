import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GchatIntegrationClient {
  deleteMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getSpace(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listMembers(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listMessages(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listSpaces(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  sendMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
