/**
 * Discord Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DiscordIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  listMyGuilds(params?: {
    limit?: number;
    before?: string;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getGuild(params: {
    guild_id: string;
    with_counts?: boolean;
  }): Promise<MCPToolCallResponse>;

  listGuildChannels(params: { guild_id: string }): Promise<MCPToolCallResponse>;

  getChannel(params: { channel_id: string }): Promise<MCPToolCallResponse>;

  sendMessage(params: {
    channel_id: string;
    content: string;
    tts?: boolean;
    reply_to_message_id?: string;
  }): Promise<MCPToolCallResponse>;

  listMessages(params: {
    channel_id: string;
    limit?: number;
    before?: string;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  editMessage(params: {
    channel_id: string;
    message_id: string;
    content: string;
  }): Promise<MCPToolCallResponse>;

  deleteMessage(params: {
    channel_id: string;
    message_id: string;
  }): Promise<MCPToolCallResponse>;
}
