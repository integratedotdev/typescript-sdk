/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface XGetMeParams { "user.fields"?: string }

export interface XGetUserParams { user_id: string; "user.fields"?: string }

export interface XSearchPostsParams { query?: string; max_results?: number; next_token?: string; "tweet.fields"?: string; "user.fields"?: string }

export interface XGetUserTimelineParams { user_id: string; max_results?: number; pagination_token?: string; "tweet.fields"?: string }

export interface XCreatePostParams { post_json: string }

export interface XDeletePostParams { tweet_id: string }

export interface XLikePostParams { user_id: string; like_json: string }

export interface XGetBookmarksParams { user_id: string; max_results?: number; pagination_token?: string }

export interface XFollowUserParams { user_id: string; follow_json: string }

