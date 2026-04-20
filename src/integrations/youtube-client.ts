/**
 * YouTube Integration Client Types
 * Fully typed interface for YouTube Data API v3 methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface YouTubeVideo {
  kind: "youtube#video";
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  contentDetails?: {
    duration: string;
    definition: string;
    caption: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
    favoriteCount: string;
  };
}

export interface YouTubeChannel {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet?: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
  };
  contentDetails?: {
    relatedPlaylists: { likes?: string; uploads?: string };
  };
  statistics?: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

export interface YouTubePlaylist {
  kind: "youtube#playlist";
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    channelTitle: string;
  };
  contentDetails?: { itemCount: number };
}

export interface YouTubePlaylistItem {
  kind: "youtube#playlistItem";
  etag: string;
  id: string;
  snippet?: {
    title: string;
    position: number;
    playlistId: string;
    resourceId: { kind: string; videoId: string };
  };
}

export interface YouTubeSubscription {
  kind: "youtube#subscription";
  etag: string;
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: { kind: string; channelId: string };
  };
  contentDetails?: { totalItemCount: number };
}

/**
 * YouTube Integration Client Interface
 */
export interface YouTubeIntegrationClient {
  // ── Read ──────────────────────────────────────────────────────────────────

  /**
   * Search for videos, channels, or playlists
   *
   * @example
   * ```typescript
   * const results = await client.youtube.search({ query: "typescript tutorial", max_results: 10 });
   * ```
   */
  search(params: {
    /** Search query text */
    query: string;
    /** video, channel, or playlist (default: video) */
    type?: "video" | "channel" | "playlist";
    /** 1–50 (default: 5) */
    max_results?: number;
    /** date, rating, relevance, title, videoCount, viewCount */
    order?: "date" | "rating" | "relevance" | "title" | "videoCount" | "viewCount";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get full details for a specific video
   *
   * @example
   * ```typescript
   * const video = await client.youtube.getVideo({ video_id: "dQw4w9WgXcQ" });
   * ```
   */
  getVideo(params: {
    /** YouTube video ID */
    video_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the authenticated user's own channel
   *
   * @example
   * ```typescript
   * const channel = await client.youtube.getMyChannel();
   * ```
   */
  getMyChannel(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * Get details for any channel by ID
   *
   * @example
   * ```typescript
   * const channel = await client.youtube.getChannel({ channel_id: "UCxxxxxx" });
   * ```
   */
  getChannel(params: {
    /** Channel ID (e.g. UCxxxxxx) */
    channel_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List videos uploaded by the authenticated user
   *
   * Makes 2 API calls internally (fetches uploads playlist, then paginates it).
   *
   * @example
   * ```typescript
   * const videos = await client.youtube.listMyVideos({ max_results: 20 });
   * ```
   */
  listMyVideos(params?: {
    /** 1–50 (default: 10) */
    max_results?: number;
    /** Pagination token from previous response */
    page_token?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the authenticated user's rating for one or more videos
   *
   * @example
   * ```typescript
   * const rating = await client.youtube.getVideoRating({ video_id: "dQw4w9WgXcQ" });
   * ```
   */
  getVideoRating(params: {
    /** Video ID, or comma-separated list (max 50) */
    video_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List playlists for the authenticated user or a specific channel
   *
   * @example
   * ```typescript
   * const playlists = await client.youtube.listPlaylists({ max_results: 25 });
   * ```
   */
  listPlaylists(params?: {
    /** Channel ID, or omit for authenticated user's playlists */
    channel_id?: string;
    /** Default: 5 */
    max_results?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get details for a specific playlist
   *
   * @example
   * ```typescript
   * const playlist = await client.youtube.getPlaylist({ playlist_id: "PLxxxxxx" });
   * ```
   */
  getPlaylist(params: {
    /** Playlist ID (e.g. PLxxxxxx) */
    playlist_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List videos in a playlist
   *
   * Each item's `id` is the playlist item ID needed for `removeFromPlaylist`.
   *
   * @example
   * ```typescript
   * const items = await client.youtube.listPlaylistItems({ playlist_id: "PLxxxxxx" });
   * ```
   */
  listPlaylistItems(params: {
    /** Playlist ID */
    playlist_id: string;
    /** Default: 10 */
    max_results?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List channels the authenticated user is subscribed to
   *
   * Each item's `id` is the subscription ID needed for `unsubscribe`.
   *
   * @example
   * ```typescript
   * const subs = await client.youtube.listSubscriptions({ max_results: 20 });
   * ```
   */
  listSubscriptions(params?: {
    /** Default: 5 */
    max_results?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List top-level comment threads on a video
   *
   * Each item's `id` is the comment thread ID needed for `replyToComment`.
   *
   * @example
   * ```typescript
   * const threads = await client.youtube.listComments({ video_id: "dQw4w9WgXcQ" });
   * ```
   */
  listComments(params: {
    /** Video ID */
    video_id: string;
    /** Default: 10 */
    max_results?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List replies to a specific comment thread
   *
   * @example
   * ```typescript
   * const replies = await client.youtube.listCommentReplies({ comment_thread_id: "Ugw..." });
   * ```
   */
  listCommentReplies(params: {
    /** Comment thread ID (the id from listComments) */
    comment_thread_id: string;
    /** Default: 20 */
    max_results?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List available caption tracks for a video
   *
   * @example
   * ```typescript
   * const captions = await client.youtube.getCaptions({ video_id: "dQw4w9WgXcQ" });
   * ```
   */
  getCaptions(params: {
    /** Video ID */
    video_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Write — engagement ────────────────────────────────────────────────────

  /**
   * Like, dislike, or remove a rating from a video
   *
   * @example
   * ```typescript
   * await client.youtube.rateVideo({ video_id: "dQw4w9WgXcQ", rating: "like" });
   * ```
   */
  rateVideo(params: {
    /** Video ID */
    video_id: string;
    /** like, dislike, or none */
    rating: "like" | "dislike" | "none";
  }): Promise<MCPToolCallResponse>;

  /**
   * Subscribe to a channel
   *
   * @example
   * ```typescript
   * await client.youtube.subscribe({ channel_id: "UCxxxxxx" });
   * ```
   */
  subscribe(params: {
    /** Channel ID to subscribe to */
    channel_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Unsubscribe from a channel
   *
   * Requires the subscription ID from `listSubscriptions`, not the channel ID.
   *
   * @example
   * ```typescript
   * await client.youtube.unsubscribe({ subscription_id: "sub_abc123" });
   * ```
   */
  unsubscribe(params: {
    /** Subscription ID (the id field from listSubscriptions) */
    subscription_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Post a new top-level comment on a video
   *
   * @example
   * ```typescript
   * await client.youtube.addComment({ video_id: "dQw4w9WgXcQ", text: "Great video!" });
   * ```
   */
  addComment(params: {
    /** Video ID to comment on */
    video_id: string;
    /** Comment text */
    text: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reply to an existing comment thread
   *
   * @example
   * ```typescript
   * await client.youtube.replyToComment({ comment_thread_id: "Ugw...", text: "Thanks!" });
   * ```
   */
  replyToComment(params: {
    /** Comment thread ID (the id from listComments) */
    comment_thread_id: string;
    /** Reply text */
    text: string;
  }): Promise<MCPToolCallResponse>;

  // ── Write — playlists ────────────────────────────────────────────────────

  /**
   * Create a new playlist
   *
   * @example
   * ```typescript
   * const pl = await client.youtube.createPlaylist({ title: "My Favorites", privacy_status: "private" });
   * ```
   */
  createPlaylist(params: {
    /** Playlist title */
    title: string;
    /** Playlist description */
    description?: string;
    /** public, private, or unlisted (default: public) */
    privacy_status?: "public" | "private" | "unlisted";
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a playlist's metadata
   *
   * Fetches current state first — only specified fields are changed.
   *
   * @example
   * ```typescript
   * await client.youtube.updatePlaylist({ playlist_id: "PLxxxxxx", title: "New Title" });
   * ```
   */
  updatePlaylist(params: {
    /** Playlist ID */
    playlist_id: string;
    /** New title */
    title?: string;
    /** New description */
    description?: string;
    /** public, private, or unlisted */
    privacy_status?: "public" | "private" | "unlisted";
  }): Promise<MCPToolCallResponse>;

  /**
   * Permanently delete a playlist
   *
   * @example
   * ```typescript
   * await client.youtube.deletePlaylist({ playlist_id: "PLxxxxxx" });
   * ```
   */
  deletePlaylist(params: {
    /** Playlist ID */
    playlist_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a video to a playlist
   *
   * @example
   * ```typescript
   * await client.youtube.addToPlaylist({ playlist_id: "PLxxxxxx", video_id: "dQw4w9WgXcQ" });
   * ```
   */
  addToPlaylist(params: {
    /** Playlist ID */
    playlist_id: string;
    /** Video ID to add */
    video_id: string;
    /** 0-indexed position in the playlist */
    position?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Remove an item from a playlist
   *
   * Requires the playlist item ID (the `id` from `listPlaylistItems`), not the video ID.
   *
   * @example
   * ```typescript
   * await client.youtube.removeFromPlaylist({ playlist_item_id: "PLitem_abc" });
   * ```
   */
  removeFromPlaylist(params: {
    /** Playlist item ID (the id field from listPlaylistItems) */
    playlist_item_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Write — video management ──────────────────────────────────────────────

  /**
   * Update a video's metadata
   *
   * Fetches current snippet first — only specified fields are changed.
   * Video must be owned by the authenticated user.
   *
   * @example
   * ```typescript
   * await client.youtube.updateVideo({
   *   video_id: "dQw4w9WgXcQ",
   *   title: "Updated Title",
   *   tags: "music,classic",
   * });
   * ```
   */
  updateVideo(params: {
    /** Video ID (must be owned by authenticated user) */
    video_id: string;
    /** New title (max 100 chars) */
    title?: string;
    /** New description (max 5000 chars) */
    description?: string;
    /** Comma-separated tag list */
    tags?: string;
    /** YouTube category ID (e.g. 22 = People & Blogs, 28 = Science & Technology) */
    category_id?: string;
  }): Promise<MCPToolCallResponse>;
}
