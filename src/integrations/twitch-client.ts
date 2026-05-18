import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TwitchIntegrationClient {
  getUsers(params: { id?: string; login?: string }): Promise<MCPToolCallResponse>;
  getStreams(params: { user_id?: string; user_login?: string; game_id?: string; first?: number; after?: string }): Promise<MCPToolCallResponse>;
  getChannels(params: { broadcaster_id?: string }): Promise<MCPToolCallResponse>;
  modifyChannel(params: { broadcaster_id?: string; channel_json: string }): Promise<MCPToolCallResponse>;
  createClip(params: { broadcaster_id?: string; has_delay?: boolean }): Promise<MCPToolCallResponse>;
  getVideos(params: { id?: string; user_id?: string; game_id?: string; first?: number; after?: string }): Promise<MCPToolCallResponse>;
  getGames(params: { id?: string; name?: string }): Promise<MCPToolCallResponse>;
  getChannelFollowers(params: { broadcaster_id?: string; user_id?: string; first?: number; after?: string }): Promise<MCPToolCallResponse>;
  getBroadcasterSubscriptions(params: { broadcaster_id?: string; user_id?: string; first?: number; after?: string }): Promise<MCPToolCallResponse>;
}
