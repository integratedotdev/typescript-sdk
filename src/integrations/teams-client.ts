import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TeamsIntegrationClient {
  getChannel(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getChat(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getProfile(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getTeam(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listChannelMessages(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listChannels(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listChatMessages(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listChats(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listTeams(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  replyChannelMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  sendChannelMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  sendChatMessage(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
