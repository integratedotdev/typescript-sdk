/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleKeepListNotesParams {
    page_size?: number;
    page_token?: string;
    filter?: string;
  }

export interface GoogleKeepGetNoteParams {
    name: string;
  }

export interface GoogleKeepCreateTextNoteParams {
    title?: string;
    text: string;
  }

export interface GoogleKeepCreateListNoteParams {
    title?: string;
    /** JSON array of strings or { text, checked, childListItems } objects */
    items: string;
  }

export interface GoogleKeepDeleteNoteParams {
    name: string;
  }

export interface GoogleKeepDownloadAttachmentParams {
    name: string;
    mime_type?: string;
  }

export interface GoogleKeepBatchCreatePermissionsParams {
    parent: string;
    /** JSON array of Google Keep Permission objects */
    permissions: string;
  }

export interface GoogleKeepBatchDeletePermissionsParams {
    parent: string;
    /** JSON array of permission resource names */
    names: string;
  }

