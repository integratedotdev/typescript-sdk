/**
 * OneDrive Integration Client Types
 * Fully typed interface for OneDrive file management methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface OneDriveDriveItem {
  id: string;
  name: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  size?: number;
  webUrl: string;
  file?: { mimeType: string };
  folder?: { childCount: number };
  parentReference?: { driveId: string; id: string; path: string };
}

/**
 * OneDrive Integration Client Interface
 * Provides type-safe methods for OneDrive file management
 */
export interface OneDriveIntegrationClient {
  /**
   * List files and folders in OneDrive
   *
   * @example
   * ```typescript
   * const files = await client.onedrive.listFiles({ path: "/Documents", top: 50 });
   * ```
   */
  listFiles(params?: {
    /** Folder path to list (defaults to root) */
    path?: string;
    /** Items to return (default 100) */
    top?: number;
    /** OData filter e.g. "file ne null" */
    filter?: string;
    /** OData sort e.g. "lastModifiedDateTime desc" */
    order_by?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get metadata for a file or folder
   *
   * @example
   * ```typescript
   * const file = await client.onedrive.getFile({ item_id: "ABC123" });
   * ```
   */
  getFile(params: {
    /** Item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the download URL for a file
   *
   * @example
   * ```typescript
   * const content = await client.onedrive.downloadFile({ item_id: "ABC123" });
   * ```
   */
  downloadFile(params: {
    /** File item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Upload a file to OneDrive
   *
   * @example
   * ```typescript
   * await client.onedrive.uploadFile({
   *   path: "/Documents",
   *   filename: "report.pdf",
   *   content: base64Content,
   * });
   * ```
   */
  uploadFile(params: {
    /** Target folder path in OneDrive */
    path: string;
    /** File name */
    filename: string;
    /** File content (base64 encoded) */
    content: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a file or folder permanently
   *
   * @example
   * ```typescript
   * await client.onedrive.deleteFile({ item_id: "ABC123" });
   * ```
   */
  deleteFile(params: {
    /** Item ID to delete */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search across all files in OneDrive
   *
   * @example
   * ```typescript
   * const results = await client.onedrive.searchFiles({ query: "budget", top: 20 });
   * ```
   */
  searchFiles(params: {
    /** Search text */
    query: string;
    /** Max results (default 25) */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a sharing link for a file or folder
   *
   * @example
   * ```typescript
   * const link = await client.onedrive.shareFile({ item_id: "ABC123", type: "view" });
   * ```
   */
  shareFile(params: {
    /** Item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }): Promise<MCPToolCallResponse>;
}
