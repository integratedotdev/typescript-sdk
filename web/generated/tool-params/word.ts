/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface WordListParams {
    /** Filter by name (default: searches .docx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }

export interface WordGetParams {
    /** Document item ID */
    item_id: string;
  }

export interface WordCreateParams {
    /** File name (.docx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }

export interface WordUpdateContentParams {
    /** Document item ID */
    item_id: string;
    /** Base64-encoded .docx bytes */
    content: string;
    /** MIME type override */
    content_type?: string;
  }

export interface WordCopyParams {
    /** Document item ID to copy */
    item_id: string;
    /** Name for the copy */
    name?: string;
    /** Destination folder item ID */
    parent_id?: string;
  }

export interface WordDeleteParams {
    /** Document item ID */
    item_id: string;
  }

export interface WordShareParams {
    /** Document item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }

