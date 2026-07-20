/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BoxListFolderItemsParams {
    folder_id: string;
    limit?: number;
    offset?: number;
    fields?: string;
  }

export interface BoxGetFileParams {
    file_id: string;
    fields?: string;
  }

export interface BoxGetFolderParams {
    folder_id: string;
    fields?: string;
  }

export interface BoxCreateFolderParams {
    parent_id: string;
    name: string;
  }

export interface BoxUpdateFileParams {
    file_id: string;
    name?: string;
    description?: string;
    parent_id?: string;
  }

export interface BoxUpdateFolderParams {
    folder_id: string;
    name?: string;
    description?: string;
    parent_id?: string;
  }

export interface BoxDeleteFileParams {
    file_id: string;
  }

export interface BoxDeleteFolderParams {
    folder_id: string;
    recursive?: boolean;
  }

export interface BoxUploadTextFileParams {
    parent_id: string;
    name: string;
    content: string;
  }

export interface BoxDownloadFileParams {
    file_id: string;
  }

export interface BoxSearchParams {
    query: string;
    type?: "file" | "folder" | "web_link";
    limit?: number;
    offset?: number;
    fields?: string;
  }

export interface BoxCreateSharedLinkParams {
    item_type: "file" | "folder";
    item_id: string;
    access?: "open" | "company" | "collaborators";
    can_download?: boolean;
    can_preview?: boolean;
  }

export interface BoxCreateCollaborationParams {
    item_type: "file" | "folder";
    item_id: string;
    accessible_by_type: "user" | "group";
    login?: string;
    accessible_by_id?: string;
    role: "editor" | "viewer" | "previewer" | "uploader" | "previewer uploader" | "viewer uploader" | "co-owner";
  }

export interface BoxListCommentsParams {
    file_id: string;
    fields?: string;
  }

export interface BoxCreateCommentParams {
    file_id: string;
    message: string;
  }

export interface BoxDeleteCommentParams {
    comment_id: string;
  }

