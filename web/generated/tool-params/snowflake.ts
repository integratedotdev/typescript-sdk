/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SnowflakeSubmitStatementParams { statement_json: string; account: string }

export interface SnowflakeGetStatementParams { statement_handle: string; "partition"?: string; account: string }

export interface SnowflakeCancelStatementParams { statement_handle: string; account: string }

export interface SnowflakeListDatabasesParams { statement_json: string; account: string }

export interface SnowflakeListWarehousesParams { statement_json: string; account: string }

