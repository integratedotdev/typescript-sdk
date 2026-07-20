/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface DatabricksCurrentUserParams { workspace_host?: string }

export interface DatabricksClustersListParams { workspace_host?: string }

export interface DatabricksClustersGetParams { cluster_id: string; workspace_host?: string }

export interface DatabricksJobsListParams { limit?: number; offset?: number; name?: string; workspace_host?: string }

export interface DatabricksJobsGetParams { job_id: string; workspace_host?: string }

export interface DatabricksJobsRunNowParams {
    job_id: string;
    notebook_params?: string;
    workspace_host?: string;
  }

export interface DatabricksSqlWarehousesListParams { workspace_host?: string }

export interface DatabricksWorkspaceGetStatusParams { path: string; workspace_host?: string }

