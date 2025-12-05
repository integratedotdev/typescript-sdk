/**
 * OneDrive Integration Client Types
 * Fully typed interface for OneDrive integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * OneDrive Drive Item
 */
export interface OneDriveDriveItem {
  id: string;
  name: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  size?: number;
  webUrl: string;
  createdBy?: {
    user?: {
      displayName: string;
      email?: string;
    };
  };
  lastModifiedBy?: {
    user?: {
      displayName: string;
      email?: string;
    };
  };
  parentReference?: {
    driveId: string;
    driveType: string;
    id: string;
    path: string;
  };
  file?: {
    mimeType: string;
    hashes?: {
      quickXorHash?: string;
      sha1Hash?: string;
    };
  };
  folder?: {
    childCount: number;
  };
  fileSystemInfo?: {
    createdDateTime: string;
    lastModifiedDateTime: string;
  };
}

/**
 * OneDrive Permission
 */
export interface OneDrivePermission {
  id: string;
  roles: string[];
  link?: {
    type: "view" | "edit" | "embed";
    scope: "anonymous" | "organization";
    webUrl: string;
  };
  grantedTo?: {
    user?: {
      displayName: string;
      email?: string;
      id: string;
    };
  };
  grantedToIdentities?: Array<{
    user?: {
      displayName: string;
      email?: string;
      id: string;
    };
  }>;
  shareId?: string;
}

/**
 * OneDrive Word Document Content
 */
export interface OneDriveWordContent {
  content: string;
  contentType: "text" | "html";
}

/**
 * OneDrive Excel Worksheet
 */
export interface OneDriveExcelWorksheet {
  id: string;
  name: string;
  position: number;
  visibility: "visible" | "hidden" | "veryHidden";
}

/**
 * OneDrive Excel Range
 */
export interface OneDriveExcelRange {
  address: string;
  addressLocal: string;
  cellCount: number;
  columnCount: number;
  rowCount: number;
  columnIndex: number;
  rowIndex: number;
  text?: string[][];
  values?: any[][];
  formulas?: string[][];
  numberFormat?: string[][];
}

/**
 * OneDrive PowerPoint Slide
 */
export interface OneDrivePowerPointSlide {
  id: string;
  slideIndex: number;
}

/**
 * OneDrive Integration Client Interface
 * Provides type-safe methods for all OneDrive operations
 */
export interface OneDriveIntegrationClient {
  /**
   * List files in a folder
   * 
   * @example
   * ```typescript
   * const files = await client.onedrive.listFiles({
   *   folder_id: "root",
   *   order_by: "lastModifiedDateTime desc"
   * });
   * ```
   */
  listFiles(params?: {
    /** Folder ID (default: "root") */
    folder_id?: string;
    /** Filter query */
    filter?: string;
    /** Order by field */
    order_by?: string;
    /** Number of items to return */
    top?: number;
    /** Number of items to skip */
    skip?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get file metadata
   * 
   * @example
   * ```typescript
   * const file = await client.onedrive.getFile({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF"
   * });
   * ```
   */
  getFile(params: {
    /** File ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Download file content
   * 
   * @example
   * ```typescript
   * const content = await client.onedrive.downloadFile({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF"
   * });
   * ```
   */
  downloadFile(params: {
    /** File ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Upload a file
   * 
   * @example
   * ```typescript
   * const file = await client.onedrive.uploadFile({
   *   folder_id: "root",
   *   file_name: "document.txt",
   *   content: "Hello, World!",
   *   conflict_behavior: "rename"
   * });
   * ```
   */
  uploadFile(params: {
    /** Parent folder ID (default: "root") */
    folder_id?: string;
    /** File name */
    file_name: string;
    /** File content (base64 encoded for binary files) */
    content: string;
    /** Conflict behavior */
    conflict_behavior?: "rename" | "replace" | "fail";
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a file
   * 
   * @example
   * ```typescript
   * await client.onedrive.deleteFile({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF"
   * });
   * ```
   */
  deleteFile(params: {
    /** File ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for files
   * 
   * @example
   * ```typescript
   * const results = await client.onedrive.searchFiles({
   *   query: "presentation",
   *   top: 20
   * });
   * ```
   */
  searchFiles(params: {
    /** Search query */
    query: string;
    /** Number of items to return */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a sharing link
   * 
   * @example
   * ```typescript
   * const permission = await client.onedrive.shareFile({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF",
   *   type: "view",
   *   scope: "anonymous"
   * });
   * ```
   */
  shareFile(params: {
    /** File ID */
    file_id: string;
    /** Link type */
    type: "view" | "edit" | "embed";
    /** Link scope */
    scope: "anonymous" | "organization";
    /** Expiration date (ISO 8601) */
    expiration_date_time?: string;
    /** Password protection */
    password?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get Word document content
   * 
   * @example
   * ```typescript
   * const content = await client.onedrive.wordGetContent({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF",
   *   format: "text"
   * });
   * ```
   */
  wordGetContent(params: {
    /** Word document file ID */
    file_id: string;
    /** Content format */
    format?: "text" | "html";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get Excel worksheets
   * 
   * @example
   * ```typescript
   * const worksheets = await client.onedrive.excelGetWorksheets({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF"
   * });
   * ```
   */
  excelGetWorksheets(params: {
    /** Excel file ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get Excel range data
   * 
   * @example
   * ```typescript
   * const range = await client.onedrive.excelGetRange({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF",
   *   worksheet_name: "Sheet1",
   *   range_address: "A1:B10"
   * });
   * ```
   */
  excelGetRange(params: {
    /** Excel file ID */
    file_id: string;
    /** Worksheet name or ID */
    worksheet_name: string;
    /** Range address (e.g., "A1:B10") */
    range_address: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update Excel range data
   * 
   * @example
   * ```typescript
   * await client.onedrive.excelUpdateRange({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF",
   *   worksheet_name: "Sheet1",
   *   range_address: "A1:B2",
   *   values: [["Name", "Age"], ["John", 30]]
   * });
   * ```
   */
  excelUpdateRange(params: {
    /** Excel file ID */
    file_id: string;
    /** Worksheet name or ID */
    worksheet_name: string;
    /** Range address (e.g., "A1:B10") */
    range_address: string;
    /** Values to set */
    values: any[][];
  }): Promise<MCPToolCallResponse>;

  /**
   * Get PowerPoint slides
   * 
   * @example
   * ```typescript
   * const slides = await client.onedrive.powerpointGetSlides({
   *   file_id: "01234567-89AB-CDEF-0123-456789ABCDEF"
   * });
   * ```
   */
  powerpointGetSlides(params: {
    /** PowerPoint file ID */
    file_id: string;
  }): Promise<MCPToolCallResponse>;
}
