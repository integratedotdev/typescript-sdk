/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleDocsListParams {
    page_size?: number;
    page_token?: string;
    query?: string;
  }

export interface GoogleDocsGetParams {
    document_id: string;
  }

export interface GoogleDocsCreateParams {
    title: string;
  }

export interface GoogleDocsDeleteParams {
    document_id: string;
  }

export interface GoogleDocsAppendTextParams {
    document_id: string;
    text: string;
  }

export interface GoogleDocsReplaceTextParams {
    document_id: string;
    find: string;
    replace: string;
    match_case?: boolean;
  }

export interface GoogleDocsBatchUpdateParams {
    document_id: string;
    requests: string;
    write_control?: string;
  }

export interface GoogleDocsListCommentsParams {
    document_id: string;
    page_size?: number;
    page_token?: string;
  }

export interface GoogleDocsCreateCommentParams {
    document_id: string;
    content: string;
    anchor?: string;
  }

export interface GoogleDocsDeleteCommentParams {
    document_id: string;
    comment_id: string;
  }

