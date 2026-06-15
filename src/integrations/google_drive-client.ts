/**
 * Google Drive Integration Client Types
 * Fully typed interface for Google Drive integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  parents?: string[];
  webViewLink?: string;
  modifiedTime?: string;
  createdTime?: string;
  owners?: Array<{ displayName: string; emailAddress: string; photoLink?: string }>;
  shared?: boolean;
  trashed?: boolean;
}

export interface GDrivePermission {
  id: string;
  type: "user" | "group" | "domain" | "anyone";
  role: "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";
  emailAddress?: string;
  domain?: string;
  displayName?: string;
  expirationTime?: string;
}

export interface GDriveAbout {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota: {
    limit?: string;
    usage: string;
    usageInDrive: string;
    usageInDriveTrash: string;
  };
}

/**
 * Google Drive Integration Client Interface
 * Provides type-safe methods for all Google Drive operations
 */
export interface GDriveIntegrationClient {
  /**
   * List files and folders in Google Drive
   *
   * @example
   * ```typescript
   * const result = await client.google_drive.listFiles({
   *   query: "name contains 'report'",
   *   order_by: "modifiedTime desc",
   *   page_size: 50,
   * });
   * ```
   */
  listFiles(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get metadata for a file or folder
   *
   * @example
   * ```typescript
   * const file = await client.google_drive.getFile({ file_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" });
   * ```
   */
  getFile(params: {
    /** File or folder ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new folder
   *
   * @example
   * ```typescript
   * const folder = await client.google_drive.createFolder({ name: "Reports 2024" });
   * ```
   */
  createFolder(params: {
    /** Folder name */
    name: string;
    /** Parent folder ID (defaults to root) */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Rename a file or folder
   *
   * @example
   * ```typescript
   * await client.google_drive.renameFile({ file_id: "abc123", name: "Q4 Report" });
   * ```
   */
  renameFile(params: {
    /** File or folder ID */
    file_id: string;
    /** New name */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Move a file or folder to a different parent
   *
   * @example
   * ```typescript
   * await client.google_drive.moveFile({ file_id: "abc123", new_parent_id: "folderId" });
   * ```
   */
  moveFile(params: {
    /** File or folder ID to move */
    file_id: string;
    /** Destination folder ID */
    new_parent_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Copy a file
   *
   * @example
   * ```typescript
   * const copy = await client.google_drive.copyFile({ file_id: "abc123", name: "Budget Copy" });
   * ```
   */
  copyFile(params: {
    /** File ID to copy */
    file_id: string;
    /** Name for the copy (defaults to "Copy of <original>") */
    name?: string;
    /** Destination folder ID */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Permanently delete a file or folder (not recoverable)
   *
   * @example
   * ```typescript
   * await client.google_drive.deleteFile({ file_id: "abc123" });
   * ```
   */
  deleteFile(params: {
    /** File or folder ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Move a file or folder to trash (recoverable)
   *
   * @example
   * ```typescript
   * await client.google_drive.trashFile({ file_id: "abc123" });
   * ```
   */
  trashFile(params: {
    /** File or folder ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new file with text content
   *
   * @example
   * ```typescript
   * const file = await client.google_drive.uploadTextFile({
   *   name: "notes.txt",
   *   content: "Hello, world!",
   * });
   * ```
   */
  uploadTextFile(params: {
    /** File name */
    name: string;
    /** Text content */
    content: string;
    /** MIME type (default: text/plain) */
    mime_type?: string;
    /** Parent folder ID */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Download file content as text. Google Workspace files are auto-exported.
   *
   * @example
   * ```typescript
   * const result = await client.google_drive.downloadFile({ file_id: "abc123" });
   * ```
   */
  downloadFile(params: {
    /** File ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List sharing permissions on a file or folder
   *
   * @example
   * ```typescript
   * const perms = await client.google_drive.listPermissions({ file_id: "abc123" });
   * ```
   */
  listPermissions(params: {
    /** File or folder ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Share a file or folder
   *
   * @example
   * ```typescript
   * await client.google_drive.shareFile({
   *   file_id: "abc123",
   *   role: "reader",
   *   type: "user",
   *   email: "colleague@example.com",
   * });
   * ```
   */
  shareFile(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Remove a sharing permission
   *
   * @example
   * ```typescript
   * await client.google_drive.removePermission({ file_id: "abc123", permission_id: "perm456" });
   * ```
   */
  removePermission(params: {
    /** File or folder ID */
    file_id: string;
    /** Permission ID (from gdrive_list_permissions) */
    permission_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get current user info and storage quota
   *
   * @example
   * ```typescript
   * const about = await client.google_drive.getAbout();
   * ```
   */
  getAbout(params?: Record<string, never>): Promise<MCPToolCallResponse>;
}
