/**
 * YouTube Integration Client Types
 * Fully typed interface for YouTube integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * YouTube Video
 */
export interface YouTubeVideo {
  kind: "youtube#video";
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized?: {
      title: string;
      description: string;
    };
  };
  contentDetails?: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    projection: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

/**
 * YouTube Channel
 */
export interface YouTubeChannel {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet?: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
    };
    localized?: {
      title: string;
      description: string;
    };
    country?: string;
  };
  contentDetails?: {
    relatedPlaylists: {
      likes?: string;
      uploads?: string;
    };
  };
  statistics?: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

/**
 * YouTube Playlist
 */
export interface YouTubePlaylist {
  kind: "youtube#playlist";
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    localized?: {
      title: string;
      description: string;
    };
  };
  contentDetails?: {
    itemCount: number;
  };
}

/**
 * YouTube Playlist Item
 */
export interface YouTubePlaylistItem {
  kind: "youtube#playlistItem";
  etag: string;
  id: string;
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt: string;
  };
}

/**
 * YouTube Comment
 */
export interface YouTubeComment {
  kind: "youtube#comment";
  etag: string;
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
      value: string;
    };
    videoId: string;
    textDisplay: string;
    textOriginal: string;
    canRate: boolean;
    viewerRating: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
  };
}

/**
 * YouTube Subscription
 */
export interface YouTubeSubscription {
  kind: "youtube#subscription";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    channelId: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
    };
  };
}

/**
 * YouTube Integration Client Interface
 * Provides type-safe methods for all YouTube operations
 */
export interface YouTubeIntegrationClient {
  /**
   * Search for videos, channels, or playlists
   * 
   * @example
   * ```typescript
   * const results = await client.youtube.search({
   *   q: "typescript tutorial",
   *   type: "video",
   *   maxResults: 10
   * });
   * ```
   */
  search(params: {
    /** Search query */
    q: string;
    /** Resource type */
    type?: "video" | "channel" | "playlist";
    /** Maximum results (1-50) */
    maxResults?: number;
    /** Order results */
    order?: "date" | "rating" | "relevance" | "title" | "videoCount" | "viewCount";
    /** Channel ID filter */
    channelId?: string;
    /** Page token for pagination */
    pageToken?: string;
    /** Published after (RFC 3339) */
    publishedAfter?: string;
    /** Published before (RFC 3339) */
    publishedBefore?: string;
    /** Region code */
    regionCode?: string;
    /** Safe search */
    safeSearch?: "moderate" | "none" | "strict";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get video details
   * 
   * @example
   * ```typescript
   * const video = await client.youtube.getVideo({
   *   video_id: "dQw4w9WgXcQ"
   * });
   * ```
   */
  getVideo(params: {
    /** Video ID */
    video_id: string;
    /** Parts to include */
    part?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * List playlists for a channel
   * 
   * @example
   * ```typescript
   * const playlists = await client.youtube.listPlaylists({
   *   channel_id: "UCxxxxxx",
   *   maxResults: 25
   * });
   * ```
   */
  listPlaylists(params: {
    /** Channel ID */
    channel_id: string;
    /** Maximum results (1-50) */
    maxResults?: number;
    /** Page token for pagination */
    pageToken?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get playlist details
   * 
   * @example
   * ```typescript
   * const playlist = await client.youtube.getPlaylist({
   *   playlist_id: "PLxxxxxx"
   * });
   * ```
   */
  getPlaylist(params: {
    /** Playlist ID */
    playlist_id: string;
    /** Parts to include */
    part?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * List videos in a playlist
   * 
   * @example
   * ```typescript
   * const items = await client.youtube.listPlaylistItems({
   *   playlist_id: "PLxxxxxx",
   *   maxResults: 50
   * });
   * ```
   */
  listPlaylistItems(params: {
    /** Playlist ID */
    playlist_id: string;
    /** Maximum results (1-50) */
    maxResults?: number;
    /** Page token for pagination */
    pageToken?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get channel details
   * 
   * @example
   * ```typescript
   * const channel = await client.youtube.getChannel({
   *   channel_id: "UCxxxxxx"
   * });
   * ```
   */
  getChannel(params: {
    /** Channel ID */
    channel_id: string;
    /** Parts to include */
    part?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * List channel subscriptions
   * 
   * @example
   * ```typescript
   * const subscriptions = await client.youtube.listSubscriptions({
   *   maxResults: 50
   * });
   * ```
   */
  listSubscriptions(params?: {
    /** Channel ID */
    channel_id?: string;
    /** Maximum results (1-50) */
    maxResults?: number;
    /** Page token for pagination */
    pageToken?: string;
    /** Order results */
    order?: "alphabetical" | "relevance" | "unread";
  }): Promise<MCPToolCallResponse>;

  /**
   * List comments on a video
   * 
   * @example
   * ```typescript
   * const comments = await client.youtube.listComments({
   *   video_id: "dQw4w9WgXcQ",
   *   maxResults: 100
   * });
   * ```
   */
  listComments(params: {
    /** Video ID */
    video_id: string;
    /** Maximum results (1-100) */
    maxResults?: number;
    /** Page token for pagination */
    pageToken?: string;
    /** Text format */
    textFormat?: "html" | "plainText";
    /** Order results */
    order?: "time" | "relevance";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get video captions/subtitles
   * 
   * @example
   * ```typescript
   * const captions = await client.youtube.getCaptions({
   *   video_id: "dQw4w9WgXcQ"
   * });
   * ```
   */
  getCaptions(params: {
    /** Video ID */
    video_id: string;
  }): Promise<MCPToolCallResponse>;
}
