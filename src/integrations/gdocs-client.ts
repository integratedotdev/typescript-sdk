/**
 * Google Docs Integration Client Types
 * Fully typed interface for Google Docs integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GDocsDocument {
  documentId: string;
  title: string;
  body: {
    content: Array<{
      startIndex?: number;
      endIndex?: number;
      paragraph?: {
        elements: Array<{
          startIndex?: number;
          endIndex?: number;
          textRun?: {
            content: string;
            textStyle?: Record<string, any>;
          };
        }>;
      };
      table?: {
        rows: number;
        columns: number;
      };
    }>;
  };
  revisionId: string;
  suggestionsViewMode: string;
}

export interface GDocsFileInfo {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
}

export interface GDocsIntegrationClient {
  list(params?: {
    page_size?: number;
    page_token?: string;
    query?: string;
  }): Promise<MCPToolCallResponse>;

  get(params: {
    document_id: string;
  }): Promise<MCPToolCallResponse>;

  create(params: {
    title: string;
  }): Promise<MCPToolCallResponse>;

  delete(params: {
    document_id: string;
  }): Promise<MCPToolCallResponse>;

  appendText(params: {
    document_id: string;
    text: string;
  }): Promise<MCPToolCallResponse>;

  replaceText(params: {
    document_id: string;
    find: string;
    replace: string;
    match_case?: boolean;
  }): Promise<MCPToolCallResponse>;

  batchUpdate(params: {
    document_id: string;
    requests: string;
    write_control?: string;
  }): Promise<MCPToolCallResponse>;

  listComments(params: {
    document_id: string;
    page_size?: number;
    page_token?: string;
  }): Promise<MCPToolCallResponse>;

  createComment(params: {
    document_id: string;
    content: string;
    anchor?: string;
  }): Promise<MCPToolCallResponse>;

  deleteComment(params: {
    document_id: string;
    comment_id: string;
  }): Promise<MCPToolCallResponse>;
}
