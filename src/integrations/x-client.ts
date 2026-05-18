import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface XIntegrationClient {
  getMe(params: { "user.fields"?: string }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string; "user.fields"?: string }): Promise<MCPToolCallResponse>;
  searchPosts(params: { query?: string; max_results?: number; next_token?: string; "tweet.fields"?: string; "user.fields"?: string }): Promise<MCPToolCallResponse>;
  getUserTimeline(params: { user_id: string; max_results?: number; pagination_token?: string; "tweet.fields"?: string }): Promise<MCPToolCallResponse>;
  createPost(params: { post_json: string }): Promise<MCPToolCallResponse>;
  deletePost(params: { tweet_id: string }): Promise<MCPToolCallResponse>;
  likePost(params: { user_id: string; like_json: string }): Promise<MCPToolCallResponse>;
  getBookmarks(params: { user_id: string; max_results?: number; pagination_token?: string }): Promise<MCPToolCallResponse>;
  followUser(params: { user_id: string; follow_json: string }): Promise<MCPToolCallResponse>;
}
