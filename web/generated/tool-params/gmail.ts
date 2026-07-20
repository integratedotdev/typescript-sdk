/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GmailSendMessageParams {
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
    replyTo?: string;
    html?: boolean;
    attachments?: Array<{
      filename: string;
      content: string;
      encoding?: string;
    }>;
  }

export interface GmailCreateDraftParams {
    to: string;
    subject: string;
    body: string;
    cc?: string;
    bcc?: string;
    is_html?: boolean;
  }

export interface GmailListMessagesParams {
    maxResults?: number;
    pageToken?: string;
    q?: string;
    labelIds?: string[];
    includeSpamTrash?: boolean;
  }

export interface GmailGetMessageParams {
    id: string;
    format?: "minimal" | "full" | "raw" | "metadata";
  }

export interface GmailSearchMessagesParams {
    query: string;
    maxResults?: number;
    pageToken?: string;
    includeSpamTrash?: boolean;
  }

export interface GmailReplyMessageParams {
    thread_id: string;
    to: string;
    subject: string;
    body: string;
    is_html?: boolean;
  }

export interface GmailListThreadsParams {
    query?: string;
    max_results?: number;
    page_token?: string;
  }

export interface GmailGetThreadParams {
    thread_id: string;
    format?: "full" | "metadata" | "minimal";
  }

export interface GmailModifyMessageParams {
    message_id: string;
    add_label_ids?: string;
    remove_label_ids?: string;
  }

export interface GmailTrashMessageParams {
    message_id: string;
  }

export interface GmailGetAttachmentParams {
    message_id: string;
    attachment_id: string;
  }

