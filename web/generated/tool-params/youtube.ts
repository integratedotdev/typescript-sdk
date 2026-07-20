/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface YoutubeSearchParams {
    /** Search query text */
    query: string;
    /** video, channel, or playlist (default: video) */
    type?: "video" | "channel" | "playlist";
    /** 1–50 (default: 5) */
    max_results?: number;
    /** date, rating, relevance, title, videoCount, viewCount */
    order?: "date" | "rating" | "relevance" | "title" | "videoCount" | "viewCount";
  }

export interface YoutubeGetVideoParams {
    /** YouTube video ID */
    video_id: string;
  }

export interface YoutubeGetChannelParams {
    /** Channel ID (e.g. UCxxxxxx) */
    channel_id: string;
  }

export interface YoutubeListMyVideosParams {
    /** 1–50 (default: 10) */
    max_results?: number;
    /** Pagination token from previous response */
    page_token?: string;
  }

export interface YoutubeGetVideoRatingParams {
    /** Video ID, or comma-separated list (max 50) */
    video_id: string;
  }

export interface YoutubeListPlaylistsParams {
    /** Channel ID, or omit for authenticated user's playlists */
    channel_id?: string;
    /** Default: 5 */
    max_results?: number;
  }

export interface YoutubeGetPlaylistParams {
    /** Playlist ID (e.g. PLxxxxxx) */
    playlist_id: string;
  }

export interface YoutubeListPlaylistItemsParams {
    /** Playlist ID */
    playlist_id: string;
    /** Default: 10 */
    max_results?: number;
  }

export interface YoutubeListSubscriptionsParams {
    /** Default: 5 */
    max_results?: number;
  }

export interface YoutubeListCommentsParams {
    /** Video ID */
    video_id: string;
    /** Default: 10 */
    max_results?: number;
  }

export interface YoutubeListCommentRepliesParams {
    /** Comment thread ID (the id from listComments) */
    comment_thread_id: string;
    /** Default: 20 */
    max_results?: number;
  }

export interface YoutubeGetCaptionsParams {
    /** Video ID */
    video_id: string;
  }

export interface YoutubeRateVideoParams {
    /** Video ID */
    video_id: string;
    /** like, dislike, or none */
    rating: "like" | "dislike" | "none";
  }

export interface YoutubeSubscribeParams {
    /** Channel ID to subscribe to */
    channel_id: string;
  }

export interface YoutubeUnsubscribeParams {
    /** Subscription ID (the id field from listSubscriptions) */
    subscription_id: string;
  }

export interface YoutubeAddCommentParams {
    /** Video ID to comment on */
    video_id: string;
    /** Comment text */
    text: string;
  }

export interface YoutubeReplyToCommentParams {
    /** Comment thread ID (the id from listComments) */
    comment_thread_id: string;
    /** Reply text */
    text: string;
  }

export interface YoutubeCreatePlaylistParams {
    /** Playlist title */
    title: string;
    /** Playlist description */
    description?: string;
    /** public, private, or unlisted (default: public) */
    privacy_status?: "public" | "private" | "unlisted";
  }

export interface YoutubeUpdatePlaylistParams {
    /** Playlist ID */
    playlist_id: string;
    /** New title */
    title?: string;
    /** New description */
    description?: string;
    /** public, private, or unlisted */
    privacy_status?: "public" | "private" | "unlisted";
  }

export interface YoutubeDeletePlaylistParams {
    /** Playlist ID */
    playlist_id: string;
  }

export interface YoutubeAddToPlaylistParams {
    /** Playlist ID */
    playlist_id: string;
    /** Video ID to add */
    video_id: string;
    /** 0-indexed position in the playlist */
    position?: number;
  }

export interface YoutubeRemoveFromPlaylistParams {
    /** Playlist item ID (the id field from listPlaylistItems) */
    playlist_item_id: string;
  }

export interface YoutubeUpdateVideoParams {
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
  }

