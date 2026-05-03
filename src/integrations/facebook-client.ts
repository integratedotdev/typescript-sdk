/**
 * Facebook Integration Client Types
 * Typed interface for Facebook Graph API Page tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FacebookGraphObject {
  id: string;
  [key: string]: unknown;
}

export interface FacebookIntegrationClient {
  getMe(params?: { fields?: string }): Promise<MCPToolCallResponse>;

  listPages(params?: { fields?: string }): Promise<MCPToolCallResponse>;

  listPagePosts(params: {
    page_id: string;
    limit?: number;
    after?: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  getObject(params: { object_id: string; fields?: string }): Promise<MCPToolCallResponse>;

  createPagePost(params: {
    page_id: string;
    message?: string;
    link?: string;
    published?: boolean;
  }): Promise<MCPToolCallResponse>;

  deleteObject(params: { object_id: string }): Promise<MCPToolCallResponse>;

  listComments(params: {
    object_id: string;
    limit?: number;
    after?: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  publishComment(params: { object_id: string; message: string }): Promise<MCPToolCallResponse>;

  getInsights(params: {
    object_id: string;
    metrics: string;
    period?: string;
    since?: string;
    until?: string;
  }): Promise<MCPToolCallResponse>;

  setCommentVisibility(params: { comment_id: string; is_hidden: boolean }): Promise<MCPToolCallResponse>;

  likeObject(params: { object_id: string }): Promise<MCPToolCallResponse>;
}
