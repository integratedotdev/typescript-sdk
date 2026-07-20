/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ExcelListParams {
    /** Filter by name (default: searches .xlsx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }

export interface ExcelGetParams {
    /** Workbook item ID */
    item_id: string;
  }

export interface ExcelCreateParams {
    /** File name (.xlsx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }

export interface ExcelDeleteParams {
    /** Workbook item ID */
    item_id: string;
  }

export interface ExcelShareParams {
    /** Workbook item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }

export interface ExcelListWorksheetsParams {
    /** Workbook item ID */
    item_id: string;
  }

export interface ExcelAddWorksheetParams {
    /** Workbook item ID */
    item_id: string;
    /** New worksheet name */
    name: string;
  }

export interface ExcelDeleteWorksheetParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }

export interface ExcelGetRangeParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation e.g. A1:C10 */
    range: string;
  }

export interface ExcelUpdateRangeParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation e.g. A1:C3 */
    range: string;
    /** JSON 2D array — must match range dimensions */
    values: string;
  }

export interface ExcelClearRangeParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation */
    range: string;
    /** All, Contents, Formats, or Hyperlinks (default: All) */
    apply_to?: "All" | "Contents" | "Formats" | "Hyperlinks";
  }

export interface ExcelGetUsedRangeParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }

export interface ExcelListTablesParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }

export interface ExcelCreateTableParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** Cell range for the table e.g. A1:D10 */
    range: string;
    /** Whether first row is a header row (default: true) */
    has_headers?: boolean;
  }

export interface ExcelGetTableRowsParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** Table name or ID */
    table: string;
    /** Max rows to return */
    top?: number;
    /** Rows to skip (for pagination) */
    skip?: number;
  }

export interface ExcelAddTableRowsParams {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** Table name or ID */
    table: string;
    /** JSON 2D array of rows */
    values: string;
  }

