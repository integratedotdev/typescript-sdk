/**
 * Google Sheets Integration Client Types
 * Fully typed interface for Google Sheets integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GSheetsSpreadsheet {
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

export interface GSheetsIntegrationClient {
  list(params?: {
    page_size?: number;
    page_token?: string;
    query?: string;
  }): Promise<MCPToolCallResponse>;

  get(params: {
    spreadsheet_id: string;
  }): Promise<MCPToolCallResponse>;

  getValues(params: {
    spreadsheet_id: string;
    range: string;
  }): Promise<MCPToolCallResponse>;

  updateValues(params: {
    spreadsheet_id: string;
    range: string;
    values: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }): Promise<MCPToolCallResponse>;

  create(params: {
    title: string;
    sheet_titles?: string;
  }): Promise<MCPToolCallResponse>;

  appendValues(params: {
    spreadsheet_id: string;
    range: string;
    values: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }): Promise<MCPToolCallResponse>;

  clearValues(params: {
    spreadsheet_id: string;
    range: string;
  }): Promise<MCPToolCallResponse>;

  batchUpdateValues(params: {
    spreadsheet_id: string;
    data: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }): Promise<MCPToolCallResponse>;
}
