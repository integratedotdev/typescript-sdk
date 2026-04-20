/**
 * Excel Integration Client Types
 * Fully typed interface for Excel workbook methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Excel Integration Client Interface
 * Provides type-safe methods for managing Excel workbooks in OneDrive
 */
export interface ExcelIntegrationClient {
  /**
   * Search for Excel workbooks
   *
   * @example
   * ```typescript
   * const workbooks = await client.excel.list({ query: "budget" });
   * ```
   */
  list(params?: {
    /** Filter by name (default: searches .xlsx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get metadata for an Excel workbook
   *
   * @example
   * ```typescript
   * const wb = await client.excel.get({ item_id: "ABC123" });
   * ```
   */
  get(params: {
    /** Workbook item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new empty .xlsx workbook in OneDrive
   *
   * @example
   * ```typescript
   * const wb = await client.excel.create({ name: "Monthly Report" });
   * ```
   */
  create(params: {
    /** File name (.xlsx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an Excel workbook permanently
   *
   * @example
   * ```typescript
   * await client.excel.delete({ item_id: "ABC123" });
   * ```
   */
  delete(params: {
    /** Workbook item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a sharing link for an Excel workbook
   *
   * @example
   * ```typescript
   * const link = await client.excel.share({ item_id: "ABC123", type: "edit" });
   * ```
   */
  share(params: {
    /** Workbook item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }): Promise<MCPToolCallResponse>;

  /**
   * List all worksheets in a workbook
   *
   * @example
   * ```typescript
   * const sheets = await client.excel.listWorksheets({ item_id: "ABC123" });
   * ```
   */
  listWorksheets(params: {
    /** Workbook item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a new worksheet to a workbook
   *
   * @example
   * ```typescript
   * await client.excel.addWorksheet({ item_id: "ABC123", name: "Summary" });
   * ```
   */
  addWorksheet(params: {
    /** Workbook item ID */
    item_id: string;
    /** New worksheet name */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a worksheet from a workbook
   *
   * @example
   * ```typescript
   * await client.excel.deleteWorksheet({ item_id: "ABC123", worksheet: "Sheet2" });
   * ```
   */
  deleteWorksheet(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get values, formulas, and formatting from a cell range
   *
   * @example
   * ```typescript
   * const data = await client.excel.getRange({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   range: "A1:C10",
   * });
   * ```
   */
  getRange(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation e.g. A1:C10 */
    range: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update cell values in a range
   *
   * @example
   * ```typescript
   * await client.excel.updateRange({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   range: "A1:B2",
   *   values: JSON.stringify([["Name", "Age"], ["Alice", 30]]),
   * });
   * ```
   */
  updateRange(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation e.g. A1:C3 */
    range: string;
    /** JSON 2D array — must match range dimensions */
    values: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Clear contents and/or formatting from a cell range
   *
   * @example
   * ```typescript
   * await client.excel.clearRange({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   range: "A1:Z100",
   * });
   * ```
   */
  clearRange(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** A1 notation */
    range: string;
    /** All, Contents, Formats, or Hyperlinks (default: All) */
    apply_to?: "All" | "Contents" | "Formats" | "Hyperlinks";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the bounding range of all data in a worksheet
   *
   * @example
   * ```typescript
   * const used = await client.excel.getUsedRange({ item_id: "ABC123", worksheet: "Sheet1" });
   * ```
   */
  getUsedRange(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all tables in a worksheet
   *
   * @example
   * ```typescript
   * const tables = await client.excel.listTables({ item_id: "ABC123", worksheet: "Sheet1" });
   * ```
   */
  listTables(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a table from a cell range
   *
   * @example
   * ```typescript
   * await client.excel.createTable({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   range: "A1:D10",
   *   has_headers: true,
   * });
   * ```
   */
  createTable(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** Cell range for the table e.g. A1:D10 */
    range: string;
    /** Whether first row is a header row (default: true) */
    has_headers?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get rows from a table
   *
   * @example
   * ```typescript
   * const rows = await client.excel.getTableRows({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   table: "Table1",
   *   top: 100,
   * });
   * ```
   */
  getTableRows(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Append rows to a table
   *
   * @example
   * ```typescript
   * await client.excel.addTableRows({
   *   item_id: "ABC123",
   *   worksheet: "Sheet1",
   *   table: "Table1",
   *   values: JSON.stringify([["Alice", 30], ["Bob", 25]]),
   * });
   * ```
   */
  addTableRows(params: {
    /** Workbook item ID */
    item_id: string;
    /** Worksheet name or ID */
    worksheet: string;
    /** Table name or ID */
    table: string;
    /** JSON 2D array of rows */
    values: string;
  }): Promise<MCPToolCallResponse>;
}
