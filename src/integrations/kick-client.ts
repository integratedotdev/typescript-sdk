import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface KickIntegrationClient {
  getUsers(params: { "id"?: string; "username"?: string }): Promise<MCPToolCallResponse>;
  getChannels(params: { "broadcaster_user_id"?: string; "slug"?: string }): Promise<MCPToolCallResponse>;
  getLivestreams(params: { "broadcaster_user_id"?: string; "category_id"?: string; "language"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  getCategories(params: { "query"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  sendChatMessage(params: { message_json: string }): Promise<MCPToolCallResponse>;
}
