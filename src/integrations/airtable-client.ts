/**
 * Airtable Integration Client Types
 * Fully typed interface for Airtable integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Airtable Base
 */
export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: "none" | "read" | "comment" | "edit" | "create";
}

/**
 * Airtable Table
 */
export interface AirtableTable {
  id: string;
  name: string;
  description?: string;
  primaryFieldId: string;
  fields: AirtableField[];
  views: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

/**
 * Airtable Field
 */
export interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: Record<string, unknown>;
}

/**
 * Airtable Record
 */
export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

/**
 * Airtable Integration Client Interface
 * Provides type-safe methods for all Airtable operations
 */
export interface AirtableIntegrationClient {
  /**
   * List all accessible bases
   * 
   * @example
   * ```typescript
   * const bases = await client.airtable.listBases({});
   * ```
   */
  listBases(params?: {
    /** Offset for pagination */
    offset?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific base
   * 
   * @example
   * ```typescript
   * const base = await client.airtable.getBase({
   *   baseId: "appXXXXXXXXXXXXXX"
   * });
   * ```
   */
  getBase(params: {
    /** Base ID */
    baseId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List tables in a base
   * 
   * @example
   * ```typescript
   * const tables = await client.airtable.listTables({
   *   baseId: "appXXXXXXXXXXXXXX"
   * });
   * ```
   */
  listTables(params: {
    /** Base ID */
    baseId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific table schema
   * 
   * @example
   * ```typescript
   * const table = await client.airtable.getTable({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX"
   * });
   * ```
   */
  getTable(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List records in a table
   * 
   * @example
   * ```typescript
   * const records = await client.airtable.listRecords({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX",
   *   maxRecords: 100
   * });
   * ```
   */
  listRecords(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Fields to include */
    fields?: string[];
    /** Filter by formula */
    filterByFormula?: string;
    /** Maximum records to return */
    maxRecords?: number;
    /** Page size */
    pageSize?: number;
    /** Sort configuration */
    sort?: Array<{
      field: string;
      direction?: "asc" | "desc";
    }>;
    /** View ID or name */
    view?: string;
    /** Cell format */
    cellFormat?: "json" | "string";
    /** Time zone */
    timeZone?: string;
    /** User locale */
    userLocale?: string;
    /** Offset for pagination */
    offset?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific record
   * 
   * @example
   * ```typescript
   * const record = await client.airtable.getRecord({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX",
   *   recordId: "recXXXXXXXXXXXXXX"
   * });
   * ```
   */
  getRecord(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record ID */
    recordId: string;
    /** Cell format */
    cellFormat?: "json" | "string";
    /** Time zone */
    timeZone?: string;
    /** User locale */
    userLocale?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new record
   * 
   * @example
   * ```typescript
   * const record = await client.airtable.createRecord({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX",
   *   fields: {
   *     "Name": "John Doe",
   *     "Email": "john@example.com"
   *   }
   * });
   * ```
   */
  createRecord(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record fields */
    fields: Record<string, unknown>;
    /** Whether to typecast values */
    typecast?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing record
   * 
   * @example
   * ```typescript
   * await client.airtable.updateRecord({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX",
   *   recordId: "recXXXXXXXXXXXXXX",
   *   fields: {
   *     "Status": "Completed"
   *   }
   * });
   * ```
   */
  updateRecord(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record ID */
    recordId: string;
    /** Fields to update */
    fields: Record<string, unknown>;
    /** Whether to typecast values */
    typecast?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search for records using a formula
   * 
   * @example
   * ```typescript
   * const results = await client.airtable.searchRecords({
   *   baseId: "appXXXXXXXXXXXXXX",
   *   tableId: "tblXXXXXXXXXXXXXX",
   *   filterByFormula: "FIND('John', {Name})"
   * });
   * ```
   */
  searchRecords(params: {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Airtable formula to filter records */
    filterByFormula: string;
    /** Fields to include in results */
    fields?: string[];
    /** Maximum records to return */
    maxRecords?: number;
    /** Sort configuration */
    sort?: Array<{
      field: string;
      direction?: "asc" | "desc";
    }>;
    /** View ID or name */
    view?: string;
  }): Promise<MCPToolCallResponse>;
}

