/**
 * Google Workspace Integration Client Types
 * Fully typed interface for Google Workspace integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Google Sheets Spreadsheet
 */
export interface GWorkspaceSpreadsheet {
  spreadsheetId: string;
  properties: {
    title: string;
    locale: string;
    autoRecalc: string;
    timeZone: string;
  };
  sheets: Array<{
    properties: {
      sheetId: number;
      title: string;
      index: number;
      sheetType: string;
      gridProperties: {
        rowCount: number;
        columnCount: number;
      };
    };
  }>;
  spreadsheetUrl: string;
}

/**
 * Google Sheets Value Range
 */
export interface GWorkspaceValueRange {
  range: string;
  majorDimension: "ROWS" | "COLUMNS";
  values: any[][];
}

/**
 * Google Docs Document
 */
export interface GWorkspaceDocument {
  documentId: string;
  title: string;
  body: {
    content: Array<{
      startIndex?: number;
      endIndex?: number;
      paragraph?: {
        elements: Array<{
          startIndex?: number;
          endIndex?: number;
          textRun?: {
            content: string;
            textStyle?: Record<string, any>;
          };
        }>;
      };
      table?: {
        rows: number;
        columns: number;
      };
    }>;
  };
  revisionId: string;
  suggestionsViewMode: string;
}

/**
 * Google Slides Presentation
 */
export interface GWorkspacePresentation {
  presentationId: string;
  pageSize: {
    width: {
      magnitude: number;
      unit: string;
    };
    height: {
      magnitude: number;
      unit: string;
    };
  };
  slides: Array<{
    objectId: string;
    pageElements?: Array<{
      objectId: string;
      size?: {
        width: {
          magnitude: number;
          unit: string;
        };
        height: {
          magnitude: number;
          unit: string;
        };
      };
      transform?: {
        scaleX: number;
        scaleY: number;
        translateX: number;
        translateY: number;
        unit: string;
      };
      shape?: {
        shapeType: string;
        text?: {
          textElements: Array<{
            textRun?: {
              content: string;
              style?: Record<string, any>;
            };
          }>;
        };
      };
      image?: {
        contentUrl: string;
        sourceUrl?: string;
      };
    }>;
  }>;
  title: string;
  revisionId: string;
}

/**
 * Google Slides Page
 */
export interface GWorkspaceSlidePage {
  objectId: string;
  pageType: string;
  pageElements?: Array<{
    objectId: string;
    size?: {
      width: { magnitude: number; unit: string };
      height: { magnitude: number; unit: string };
    };
    transform?: {
      scaleX: number;
      scaleY: number;
      translateX: number;
      translateY: number;
      unit: string;
    };
    shape?: {
      shapeType: string;
      text?: {
        textElements: Array<{
          textRun?: {
            content: string;
            style?: Record<string, any>;
          };
        }>;
      };
    };
    image?: {
      contentUrl: string;
      sourceUrl?: string;
    };
  }>;
}

/**
 * Google Workspace Integration Client Interface
 * Provides type-safe methods for all Google Workspace operations
 */
export interface GWorkspaceIntegrationClient {
  /**
   * List spreadsheets from Google Drive
   * 
   * @example
   * ```typescript
   * const spreadsheets = await client.gworkspace.sheetsList({
   *   page_size: 10,
   *   order_by: "modifiedTime desc"
   * });
   * ```
   */
  sheetsList(params?: {
    /** Maximum number of results */
    page_size?: number;
    /** Page token for pagination */
    page_token?: string;
    /** Order by field */
    order_by?: string;
    /** Query filter */
    q?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get spreadsheet details
   * 
   * @example
   * ```typescript
   * const sheet = await client.gworkspace.sheetsGet({
   *   spreadsheet_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
   * });
   * ```
   */
  sheetsGet(params: {
    /** Spreadsheet ID */
    spreadsheet_id: string;
    /** Include grid data */
    include_grid_data?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get values from a range
   * 
   * @example
   * ```typescript
   * const values = await client.gworkspace.sheetsGetValues({
   *   spreadsheet_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
   *   range: "Sheet1!A1:B10"
   * });
   * ```
   */
  sheetsGetValues(params: {
    /** Spreadsheet ID */
    spreadsheet_id: string;
    /** Range in A1 notation (e.g., "Sheet1!A1:B10") */
    range: string;
    /** Major dimension */
    major_dimension?: "ROWS" | "COLUMNS";
    /** Value render option */
    value_render_option?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA";
    /** Date time render option */
    date_time_render_option?: "SERIAL_NUMBER" | "FORMATTED_STRING";
  }): Promise<MCPToolCallResponse>;

  /**
   * Update values in a range
   * 
   * @example
   * ```typescript
   * await client.gworkspace.sheetsUpdateValues({
   *   spreadsheet_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
   *   range: "Sheet1!A1:B2",
   *   values: [["Name", "Age"], ["John", 30]]
   * });
   * ```
   */
  sheetsUpdateValues(params: {
    /** Spreadsheet ID */
    spreadsheet_id: string;
    /** Range in A1 notation */
    range: string;
    /** Values to update */
    values: any[][];
    /** Value input option */
    value_input_option?: "RAW" | "USER_ENTERED";
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new spreadsheet
   * 
   * @example
   * ```typescript
   * const sheet = await client.gworkspace.sheetsCreate({
   *   title: "My New Spreadsheet",
   *   sheets: [{ properties: { title: "Sheet1" } }]
   * });
   * ```
   */
  sheetsCreate(params: {
    /** Spreadsheet title */
    title: string;
    /** Sheet properties */
    sheets?: Array<{
      properties: {
        title: string;
        gridProperties?: {
          rowCount?: number;
          columnCount?: number;
        };
      };
    }>;
  }): Promise<MCPToolCallResponse>;

  /**
   * List documents from Google Drive
   * 
   * @example
   * ```typescript
   * const docs = await client.gworkspace.docsList({
   *   page_size: 10
   * });
   * ```
   */
  docsList(params?: {
    /** Maximum number of results */
    page_size?: number;
    /** Page token for pagination */
    page_token?: string;
    /** Order by field */
    order_by?: string;
    /** Query filter */
    q?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get document details
   * 
   * @example
   * ```typescript
   * const doc = await client.gworkspace.docsGet({
   *   document_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
   * });
   * ```
   */
  docsGet(params: {
    /** Document ID */
    document_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new document
   * 
   * @example
   * ```typescript
   * const doc = await client.gworkspace.docsCreate({
   *   title: "My New Document"
   * });
   * ```
   */
  docsCreate(params: {
    /** Document title */
    title: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List presentations from Google Drive
   * 
   * @example
   * ```typescript
   * const presentations = await client.gworkspace.slidesList({
   *   page_size: 10
   * });
   * ```
   */
  slidesList(params?: {
    /** Maximum number of results */
    page_size?: number;
    /** Page token for pagination */
    page_token?: string;
    /** Order by field */
    order_by?: string;
    /** Query filter */
    q?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get presentation details
   * 
   * @example
   * ```typescript
   * const presentation = await client.gworkspace.slidesGet({
   *   presentation_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
   * });
   * ```
   */
  slidesGet(params: {
    /** Presentation ID */
    presentation_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific slide page
   * 
   * @example
   * ```typescript
   * const page = await client.gworkspace.slidesGetPage({
   *   presentation_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
   *   page_object_id: "p1"
   * });
   * ```
   */
  slidesGetPage(params: {
    /** Presentation ID */
    presentation_id: string;
    /** Page object ID */
    page_object_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new presentation
   * 
   * @example
   * ```typescript
   * const presentation = await client.gworkspace.slidesCreate({
   *   title: "My New Presentation"
   * });
   * ```
   */
  slidesCreate(params: {
    /** Presentation title */
    title: string;
  }): Promise<MCPToolCallResponse>;
}
