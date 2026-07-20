/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleSheetsListParams {
    page_size?: number;
    page_token?: string;
    query?: string;
  }

export interface GoogleSheetsGetParams {
    spreadsheet_id: string;
  }

export interface GoogleSheetsGetValuesParams {
    spreadsheet_id: string;
    range: string;
  }

export interface GoogleSheetsUpdateValuesParams {
    spreadsheet_id: string;
    range: string;
    values: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }

export interface GoogleSheetsCreateParams {
    title: string;
    sheet_titles?: string;
  }

export interface GoogleSheetsDeleteParams {
    spreadsheet_id: string;
  }

export interface GoogleSheetsAppendValuesParams {
    spreadsheet_id: string;
    range: string;
    values: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }

export interface GoogleSheetsClearValuesParams {
    spreadsheet_id: string;
    range: string;
  }

export interface GoogleSheetsBatchUpdateValuesParams {
    spreadsheet_id: string;
    data: string;
    value_input_option?: "RAW" | "USER_ENTERED";
  }

export interface GoogleSheetsBatchUpdateParams {
    spreadsheet_id: string;
    requests: string;
    include_spreadsheet_in_response?: boolean;
    response_ranges?: string;
    response_include_grid_data?: boolean;
  }

