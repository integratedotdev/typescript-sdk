/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZohoCrmListRecordsParams { module_api_name: string; page?: number; per_page?: number }

export interface ZohoCrmGetRecordParams { module_api_name: string; record_id: string }

export interface ZohoCrmCreateRecordsParams { module_api_name: string; records_json: string }

export interface ZohoCrmUpdateRecordParams { module_api_name: string; record_id: string; record_json: string }

export interface ZohoCrmSearchRecordsParams { module_api_name: string; criteria?: string; email?: string; phone?: string; word?: string }

export interface ZohoCrmCoqlQueryParams { query_json: string }

export interface ZohoCrmListUsersParams { type?: string; page?: number; per_page?: number }

