/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface NeonCreateApiKeyParams { key_name: string }

export interface NeonRevokeApiKeyParams { key_id: number }

export interface NeonListProjectsParams {
    cursor?: string;
    limit?: number;
    search?: string;
    org_id?: string;
    recoverable?: boolean;
  }

export interface NeonListSharedProjectsParams { cursor?: string; limit?: number; search?: string }

export interface NeonCreateProjectParams {
    name: string;
    org_id?: string;
    region_id?: string;
    pg_version?: number;
    branch_name?: string;
    database_name?: string;
    role_name?: string;
  }

export interface NeonGetProjectParams { project_id: string }

export interface NeonUpdateProjectParams { project_id: string; name: string }

export interface NeonDeleteProjectParams { project_id: string }

export interface NeonRecoverProjectParams { project_id: string }

export interface NeonListBranchesParams {
    project_id: string;
    cursor?: string;
    limit?: number;
    search?: string;
    sort_by?: string;
    include_deleted?: boolean;
  }

export interface NeonCreateBranchParams {
    project_id: string;
    name?: string;
    parent_id?: string;
    read_write_endpoint?: boolean;
  }

export interface NeonGetBranchParams { project_id: string; branch_id: string }

export interface NeonDeleteBranchParams { project_id: string; branch_id: string; hard_delete?: boolean }

export interface NeonListOperationsParams { project_id: string; cursor?: string; limit?: number }

export interface NeonGetOperationParams { project_id: string; operation_id: string }

export interface NeonGetConnectionUriParams {
    project_id: string;
    database_name: string;
    role_name: string;
    branch_id?: string;
    endpoint_id?: string;
    pooled?: boolean;
  }

