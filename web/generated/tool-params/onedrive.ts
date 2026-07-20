/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface OnedriveListFilesParams {
    /** Folder path to list (defaults to root) */
    path?: string;
    /** Items to return (default 100) */
    top?: number;
    /** OData filter e.g. "file ne null" */
    filter?: string;
    /** OData sort e.g. "lastModifiedDateTime desc" */
    order_by?: string;
  }

export interface OnedriveGetFileParams {
    /** Item ID */
    item_id: string;
  }

export interface OnedriveDownloadFileParams {
    /** File item ID */
    item_id: string;
  }

export interface OnedriveUploadFileParams {
    /** Target folder path in OneDrive */
    path: string;
    /** File name */
    filename: string;
    /** File content (base64 encoded) */
    content: string;
  }

export interface OnedriveCreateFolderParams {
    /** Folder name */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }

export interface OnedriveDeleteFileParams {
    /** Item ID to delete */
    item_id: string;
  }

export interface OnedriveSearchFilesParams {
    /** Search text */
    query: string;
    /** Max results (default 25) */
    top?: number;
  }

export interface OnedriveShareFileParams {
    /** Item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }

export interface OnedriveListPermissionsParams {
    /** File or folder item ID */
    item_id: string;
  }

export interface OnedriveRemovePermissionParams {
    /** File or folder item ID */
    item_id: string;
    /** Permission ID to remove */
    permission_id: string;
  }

