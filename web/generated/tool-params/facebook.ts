/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface FacebookGetMeParams { fields?: string }

export interface FacebookListPagesParams { fields?: string }

export interface FacebookListPagePostsParams {
    page_id: string;
    limit?: number;
    after?: string;
    fields?: string;
  }

export interface FacebookGetObjectParams { object_id: string; fields?: string }

export interface FacebookCreatePagePostParams {
    page_id: string;
    message?: string;
    link?: string;
    published?: boolean;
  }

export interface FacebookDeleteObjectParams { object_id: string }

export interface FacebookListCommentsParams {
    object_id: string;
    limit?: number;
    after?: string;
    fields?: string;
  }

export interface FacebookPublishCommentParams { object_id: string; message: string }

export interface FacebookGetInsightsParams {
    object_id: string;
    metrics: string;
    period?: string;
    since?: string;
    until?: string;
  }

export interface FacebookSetCommentVisibilityParams { comment_id: string; is_hidden: boolean }

export interface FacebookLikeObjectParams { object_id: string }

