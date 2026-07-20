/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface InstagramListPagesParams { fields?: string }

export interface InstagramGetProfileParams {
    ig_user_id: string;
    fields?: string;
  }

export interface InstagramListMediaParams {
    ig_user_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }

export interface InstagramGetMediaParams {
    media_id: string;
    fields?: string;
  }

export interface InstagramListCommentsParams {
    media_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }

export interface InstagramReplyCommentParams {
    comment_id: string;
    message: string;
  }

export interface InstagramDeleteCommentParams { comment_id: string }

export interface InstagramHideCommentParams {
    comment_id: string;
    hide?: boolean;
  }

export interface InstagramGetMediaInsightsParams {
    media_id: string;
    metric: string;
  }

export interface InstagramGetUserInsightsParams {
    ig_user_id: string;
    metric: string;
    period?: string;
  }

export interface InstagramCreateMediaContainerParams {
    ig_user_id: string;
    image_url?: string;
    video_url?: string;
    caption?: string;
    media_type?: string;
    children?: string;
    is_carousel_item?: boolean;
  }

export interface InstagramPublishMediaParams {
    ig_user_id: string;
    creation_id: string;
  }

export interface InstagramListStoriesParams {
    ig_user_id: string;
    fields?: string;
  }

export interface InstagramListTaggedMediaParams {
    ig_user_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }

