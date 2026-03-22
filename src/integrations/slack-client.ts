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
  // ── Messaging ──────────────────────────────────────────────

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
    /** Channel ID or name */
    channel: string;
    /** Message text */
    text: string;
    /** Parent message timestamp (to reply in a thread) */
    thread_ts?: string;
    /** Enable/disable link unfurling */
    unfurl_links?: boolean;
    /** Enable/disable media unfurling */
    unfurl_media?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get message history from a channel
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
    /** Channel ID */
    channel: string;
    /** Max messages to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Only messages after this Unix timestamp */
    oldest?: string;
    /** Only messages before this Unix timestamp */
    latest?: string;
    /** Include messages at boundary timestamps */
    inclusive?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get all replies in a message thread
   *
   * @example
   * ```typescript
   * const replies = await client.slack.getThreadReplies({
   *   channel: "C1234567890",
   *   thread_ts: "1234567890.123456"
   * });
   * ```
   */
  getThreadReplies(params: {
    /** Channel ID */
    channel: string;
    /** Timestamp of the parent message */
    thread_ts: string;
    /** Max replies to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update the text of an existing message
   *
   * @example
   * ```typescript
   * const result = await client.slack.updateMessage({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456",
   *   text: "Updated message text"
   * });
   * ```
   */
  updateMessage(params: {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message to update */
    timestamp: string;
    /** New message text */
    text: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a message
   *
   * @example
   * ```typescript
   * const result = await client.slack.deleteMessage({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456"
   * });
   * ```
   */
  deleteMessage(params: {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message to delete */
    timestamp: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Schedule a message to be sent at a future time
   *
   * @example
   * ```typescript
   * const result = await client.slack.scheduleMessage({
   *   channel: "C1234567890",
   *   text: "Good morning!",
   *   post_at: "1734000000"
   * });
   * ```
   */
  scheduleMessage(params: {
    /** Channel ID */
    channel: string;
    /** Message text */
    text: string;
    /** Unix timestamp (as string) for when to send */
    post_at: string;
    /** Thread timestamp to reply to */
    thread_ts?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a permanent URL for a specific message
   *
   * @example
   * ```typescript
   * const result = await client.slack.getPermalink({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456"
   * });
   * ```
   */
  getPermalink(params: {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message */
    timestamp: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for messages across the workspace
   *
   * @example
   * ```typescript
   * const results = await client.slack.searchMessages({
   *   query: "important announcement"
   * });
   * ```
   */
  searchMessages(params: {
    /** Search query string */
    query: string;
    /** Results per page (max 100) */
    count?: number;
    /** Page number */
    page?: number;
    /** Sort order: score or timestamp */
    sort?: "score" | "timestamp";
    /** Sort direction */
    sort_dir?: "asc" | "desc";
  }): Promise<MCPToolCallResponse>;

  // ── Channels ───────────────────────────────────────────────

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
    /** Exclude archived channels (default: true) */
    exclude_archived?: boolean;
    /** Max channels to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Comma-separated types: public_channel, private_channel, mpim, im */
    types?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get details about a specific channel
   *
   * @example
   * ```typescript
   * const channel = await client.slack.getChannel({
   *   channel: "C1234567890"
   * });
   * ```
   */
  getChannel(params: {
    /** Channel ID */
    channel: string;
    /** Include member count */
    include_num_members?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new channel
   *
   * @example
   * ```typescript
   * const result = await client.slack.createChannel({
   *   name: "new-project",
   *   is_private: false
   * });
   * ```
   */
  createChannel(params: {
    /** Channel name */
    name: string;
    /** Create as private channel (default: false) */
    is_private?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Invite one or more users to a channel
   *
   * @example
   * ```typescript
   * const result = await client.slack.inviteToChannel({
   *   channel: "C1234567890",
   *   users: "U1234567890,U0987654321"
   * });
   * ```
   */
  inviteToChannel(params: {
    /** Channel ID */
    channel: string;
    /** Comma-separated user IDs */
    users: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all members of a channel
   *
   * @example
   * ```typescript
   * const members = await client.slack.listChannelMembers({
   *   channel: "C1234567890"
   * });
   * ```
   */
  listChannelMembers(params: {
    /** Channel ID */
    channel: string;
    /** Max members to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Set the topic of a channel
   *
   * @example
   * ```typescript
   * const result = await client.slack.setChannelTopic({
   *   channel: "C1234567890",
   *   topic: "Q1 Planning"
   * });
   * ```
   */
  setChannelTopic(params: {
    /** Channel ID */
    channel: string;
    /** New topic text */
    topic: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Archive a channel
   *
   * @example
   * ```typescript
   * const result = await client.slack.archiveChannel({
   *   channel: "C1234567890"
   * });
   * ```
   */
  archiveChannel(params: {
    /** Channel ID */
    channel: string;
  }): Promise<MCPToolCallResponse>;

  // ── Users ──────────────────────────────────────────────────

  /**
   * List all users in the workspace
   *
   * @example
   * ```typescript
   * const users = await client.slack.listUsers({
   *   limit: 100
   * });
   * ```
   */
  listUsers(params?: {
    /** Max users to return */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Include locale info */
    include_locale?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get detailed profile for a user
   *
   * @example
   * ```typescript
   * const user = await client.slack.getUser({
   *   user: "U1234567890"
   * });
   * ```
   */
  getUser(params: {
    /** User ID */
    user: string;
    /** Include locale info */
    include_locale?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Find a user by their email address
   *
   * @example
   * ```typescript
   * const user = await client.slack.lookupUserByEmail({
   *   email: "user@example.com"
   * });
   * ```
   */
  lookupUserByEmail(params: {
    /** Email address */
    email: string;
  }): Promise<MCPToolCallResponse>;

  // ── Reactions ──────────────────────────────────────────────

  /**
   * Add an emoji reaction to a message
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
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
    /** Emoji name without colons (e.g., thumbsup) */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Remove an emoji reaction from a message
   *
   * @example
   * ```typescript
   * await client.slack.removeReaction({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456",
   *   name: "thumbsup"
   * });
   * ```
   */
  removeReaction(params: {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
    /** Emoji name without colons */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get all reactions on a message
   *
   * @example
   * ```typescript
   * const reactions = await client.slack.getReactions({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456"
   * });
   * ```
   */
  getReactions(params: {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }): Promise<MCPToolCallResponse>;

  // ── Files ──────────────────────────────────────────────────

  /**
   * Upload a text file to one or more channels
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
    /** Comma-separated channel IDs */
    channels: string;
    /** File content as text */
    content: string;
    /** Filename */
    filename: string;
    /** File type (e.g., text, python, json) */
    filetype?: string;
    /** Comment to post with the file */
    initial_comment?: string;
    /** File title */
    title?: string;
    /** Thread timestamp to attach to */
    thread_ts?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Pins ───────────────────────────────────────────────────

  /**
   * Pin a message in a channel
   *
   * @example
   * ```typescript
   * await client.slack.pinMessage({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456"
   * });
   * ```
   */
  pinMessage(params: {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Unpin a message in a channel
   *
   * @example
   * ```typescript
   * await client.slack.unpinMessage({
   *   channel: "C1234567890",
   *   timestamp: "1234567890.123456"
   * });
   * ```
   */
  unpinMessage(params: {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all pinned items in a channel
   *
   * @example
   * ```typescript
   * const pins = await client.slack.listPins({
   *   channel: "C1234567890"
   * });
   * ```
   */
  listPins(params: {
    /** Channel ID */
    channel: string;
  }): Promise<MCPToolCallResponse>;
}
