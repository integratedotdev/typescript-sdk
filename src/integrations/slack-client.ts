/**
 * Slack Integration Client Types
 * Fully typed interface for Slack integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Slack Channel
 */
export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  created: number;
  creator: string;
  is_archived: boolean;
  is_general: boolean;
  name_normalized: string;
  is_member: boolean;
  topic?: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose?: {
    value: string;
    creator: string;
    last_set: number;
  };
  num_members?: number;
}

/**
 * Slack User
 */
export interface SlackUser {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  real_name?: string;
  tz?: string;
  tz_label?: string;
  tz_offset?: number;
  profile: {
    avatar_hash?: string;
    status_text?: string;
    status_emoji?: string;
    real_name?: string;
    display_name?: string;
    email?: string;
    image_24?: string;
    image_32?: string;
    image_48?: string;
    image_72?: string;
    image_192?: string;
    image_512?: string;
  };
  is_admin?: boolean;
  is_owner?: boolean;
  is_primary_owner?: boolean;
  is_bot?: boolean;
  updated?: number;
}

/**
 * Slack Message
 */
export interface SlackMessage {
  type: string;
  user?: string;
  text: string;
  ts: string;
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  reactions?: Array<{
    name: string;
    count: number;
    users: string[];
  }>;
  attachments?: Array<Record<string, unknown>>;
  blocks?: Array<Record<string, unknown>>;
}

/**
 * Slack Integration Client Interface
 * Provides type-safe methods for all Slack operations
 */
export interface SlackIntegrationClient {
  /**
   * Send a message to a Slack channel
   * 
   * @example
   * ```typescript
   * const result = await client.slack.sendMessage({
   *   channel: "C1234567890",
   *   text: "Hello, World!"
   * });
   * ```
   */
  sendMessage(params: {
    /** Channel, private group, or IM channel to send message to */
    channel: string;
    /** Text of the message to send */
    text: string;
    /** Thread timestamp to reply in a thread */
    thread_ts?: string;
    /** Disable link previews */
    unfurl_links?: boolean;
    /** Disable media previews */
    unfurl_media?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * List channels in the workspace
   * 
   * @example
   * ```typescript
   * const channels = await client.slack.listChannels({
   *   types: "public_channel,private_channel"
   * });
   * ```
   */
  listChannels(params?: {
    /** Mix and match channel types */
    types?: string;
    /** Exclude archived channels */
    exclude_archived?: boolean;
    /** Limit results */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get information about a channel
   * 
   * @example
   * ```typescript
   * const channel = await client.slack.getChannel({
   *   channel: "C1234567890"
   * });
   * ```
   */
  getChannel(params: {
    /** Channel to get info for */
    channel: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List users in the workspace
   * 
   * @example
   * ```typescript
   * const users = await client.slack.listUsers({
   *   limit: 100
   * });
   * ```
   */
  listUsers(params?: {
    /** Limit results */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get information about a user
   * 
   * @example
   * ```typescript
   * const user = await client.slack.getUser({
   *   user: "U1234567890"
   * });
   * ```
   */
  getUser(params: {
    /** User to get info for */
    user: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List messages in a channel
   * 
   * @example
   * ```typescript
   * const messages = await client.slack.listMessages({
   *   channel: "C1234567890",
   *   limit: 50
   * });
   * ```
   */
  listMessages(params: {
    /** Channel to fetch messages from */
    channel: string;
    /** Number of messages to return */
    limit?: number;
    /** Start of time range */
    oldest?: string;
    /** End of time range */
    latest?: string;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a reaction to a message
   * 
   * @example
   * ```typescript
   * await client.slack.addReaction({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456",
   *   name: "thumbsup"
   * });
   * ```
   */
  addReaction(params: {
    /** Channel where the message is */
    channel: string;
    /** Timestamp of the message */
    timestamp: string;
    /** Reaction emoji name (without colons) */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for messages
   * 
   * @example
   * ```typescript
   * const results = await client.slack.searchMessages({
   *   query: "important announcement"
   * });
   * ```
   */
  searchMessages(params: {
    /** Search query */
    query: string;
    /** Sort order (score or timestamp) */
    sort?: "score" | "timestamp";
    /** Sort direction */
    sort_dir?: "asc" | "desc";
    /** Number of results per page */
    count?: number;
    /** Page number */
    page?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Upload a file to Slack
   * 
   * @example
   * ```typescript
   * await client.slack.uploadFile({
   *   channels: "C1234567890",
   *   content: "file content here",
   *   filename: "example.txt"
   * });
   * ```
   */
  uploadFile(params: {
    /** Comma-separated list of channel IDs */
    channels?: string;
    /** File contents */
    content?: string;
    /** Filename */
    filename?: string;
    /** File type identifier */
    filetype?: string;
    /** Initial comment */
    initial_comment?: string;
    /** Title of file */
    title?: string;
  }): Promise<MCPToolCallResponse>;
}

