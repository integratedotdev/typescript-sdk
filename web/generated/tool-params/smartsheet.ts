/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SmartsheetListSheetsParams { page?: number; pageSize?: number; includeAll?: boolean }

export interface SmartsheetGetSheetParams { sheet_id: string; include?: string; page?: number; pageSize?: number }

export interface SmartsheetCreateSheetParams { sheet_json: string }

export interface SmartsheetAddRowsParams { sheet_id: string; rows_json: string }

export interface SmartsheetUpdateRowsParams { sheet_id: string; rows_json: string }

export interface SmartsheetListWorkspacesParams { page?: number; pageSize?: number }

export interface SmartsheetListReportsParams { page?: number; pageSize?: number }

export interface SmartsheetListAttachmentsParams { sheet_id: string }

