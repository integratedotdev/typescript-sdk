/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleDriveListFilesParams {
    /** Files to return (default 20, max 1000) */
    page_size?: number;
    /** Pagination token */
    page_token?: string;
    /** Drive query string e.g. "name contains 'report'" */
    query?: string;
    /** Only list files in this folder ID */
    parent_id?: string;
    /** Sort order e.g. "modifiedTime desc" */
    order_by?: string;
  }

export interface GoogleDriveGetFileParams {
    /** File or folder ID */
    file_id: string;
  }

export interface GoogleDriveCreateFolderParams {
    /** Folder name */
    name: string;
    /** Parent folder ID (defaults to root) */
    parent_id?: string;
  }

export interface GoogleDriveRenameFileParams {
    /** File or folder ID */
    file_id: string;
    /** New name */
    name: string;
  }

export interface GoogleDriveMoveFileParams {
    /** File or folder ID to move */
    file_id: string;
    /** Destination folder ID */
    new_parent_id: string;
  }

export interface GoogleDriveCopyFileParams {
    /** File ID to copy */
    file_id: string;
    /** Name for the copy (defaults to "Copy of <original>") */
    name?: string;
    /** Destination folder ID */
    parent_id?: string;
  }

export interface GoogleDriveDeleteFileParams {
    /** File or folder ID */
    file_id: string;
  }

export interface GoogleDriveTrashFileParams {
    /** File or folder ID */
    file_id: string;
  }

export interface GoogleDriveUploadTextFileParams {
    /** File name */
    name: string;
    /** Text content */
    content: string;
    /** MIME type (default: text/plain) */
    mime_type?: string;
    /** Parent folder ID */
    parent_id?: string;
  }

export interface GoogleDriveDownloadFileParams {
    /** File ID */
    file_id: string;
  }

export interface GoogleDriveListPermissionsParams {
    /** File or folder ID */
    file_id: string;
  }

export interface GoogleDriveShareFileParams {
    /** File or folder ID */
    file_id: string;
    /** reader, commenter, writer, or owner */
    role: "reader" | "commenter" | "writer" | "owner";
    /** user, group, domain, or anyone */
    type: "user" | "group" | "domain" | "anyone";
    /** Required when type is user or group */
    email?: string;
    /** Required when type is domain */
    domain?: string;
    /** Send notification email (default: true) */
    send_notification?: boolean;
  }

export interface GoogleDriveRemovePermissionParams {
    /** File or folder ID */
    file_id: string;
    /** Permission ID (from gdrive_list_permissions) */
    permission_id: string;
  }

