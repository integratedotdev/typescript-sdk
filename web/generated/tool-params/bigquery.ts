/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BigqueryListProjectsParams { "maxResults"?: number; "pageToken"?: string }

export interface BigqueryListDatasetsParams { project_id: string; "maxResults"?: number; "pageToken"?: string }

export interface BigqueryListTablesParams { project_id: string; dataset_id: string; "maxResults"?: number; "pageToken"?: string }

export interface BigqueryGetTableParams { project_id: string; dataset_id: string; table_id: string }

export interface BigqueryQueryParams { project_id: string; query_json: string }

export interface BigqueryListJobsParams { project_id: string; "maxResults"?: number; "pageToken"?: string }

