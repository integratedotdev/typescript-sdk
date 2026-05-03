/**
 * Instagram Integration Client Types
 * Typed interface for Instagram Graph API (via Facebook Graph) tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface InstagramIntegrationClient {
  listPages(params?: { fields?: string }): Promise<MCPToolCallResponse>;

  getProfile(params: {
    ig_user_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  listMedia(params: {
    ig_user_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  getMedia(params: {
    media_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  listComments(params: {
    media_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;

  replyComment(params: {
    comment_id: string;
    message: string;
  }): Promise<MCPToolCallResponse>;

  deleteComment(params: { comment_id: string }): Promise<MCPToolCallResponse>;

  hideComment(params: {
    comment_id: string;
    hide?: boolean;
  }): Promise<MCPToolCallResponse>;

  getMediaInsights(params: {
    media_id: string;
    metric: string;
  }): Promise<MCPToolCallResponse>;

  getUserInsights(params: {
    ig_user_id: string;
    metric: string;
    period?: string;
  }): Promise<MCPToolCallResponse>;

  createMediaContainer(params: {
    ig_user_id: string;
    image_url?: string;
    video_url?: string;
    caption?: string;
    media_type?: string;
    children?: string;
    is_carousel_item?: boolean;
  }): Promise<MCPToolCallResponse>;

  publishMedia(params: {
    ig_user_id: string;
    creation_id: string;
  }): Promise<MCPToolCallResponse>;

  listStories(params: {
    ig_user_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  listTaggedMedia(params: {
    ig_user_id: string;
    fields?: string;
    limit?: number;
    after?: string;
  }): Promise<MCPToolCallResponse>;
}
