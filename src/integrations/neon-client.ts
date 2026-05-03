/**
 * Neon integration client — typed tool calls for the Neon API integration.
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface NeonIntegrationClient {
  listApiKeys(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  createApiKey(params: { key_name: string }): Promise<MCPToolCallResponse>;
  revokeApiKey(params: { key_id: number }): Promise<MCPToolCallResponse>;
  listOrganizations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listProjects(params?: {
    cursor?: string;
    limit?: number;
    search?: string;
    org_id?: string;
    recoverable?: boolean;
  }): Promise<MCPToolCallResponse>;
  listSharedProjects(params?: { cursor?: string; limit?: number; search?: string }): Promise<MCPToolCallResponse>;
  createProject(params: {
    name: string;
    org_id?: string;
    region_id?: string;
    pg_version?: number;
    branch_name?: string;
    database_name?: string;
    role_name?: string;
  }): Promise<MCPToolCallResponse>;
  getProject(params: { project_id: string }): Promise<MCPToolCallResponse>;
  updateProject(params: { project_id: string; name: string }): Promise<MCPToolCallResponse>;
  deleteProject(params: { project_id: string }): Promise<MCPToolCallResponse>;
  recoverProject(params: { project_id: string }): Promise<MCPToolCallResponse>;
  listBranches(params: {
    project_id: string;
    cursor?: string;
    limit?: number;
    search?: string;
    sort_by?: string;
    include_deleted?: boolean;
  }): Promise<MCPToolCallResponse>;
  createBranch(params: {
    project_id: string;
    name?: string;
    parent_id?: string;
    read_write_endpoint?: boolean;
  }): Promise<MCPToolCallResponse>;
  getBranch(params: { project_id: string; branch_id: string }): Promise<MCPToolCallResponse>;
  deleteBranch(params: { project_id: string; branch_id: string; hard_delete?: boolean }): Promise<MCPToolCallResponse>;
  listOperations(params: { project_id: string; cursor?: string; limit?: number }): Promise<MCPToolCallResponse>;
  getOperation(params: { project_id: string; operation_id: string }): Promise<MCPToolCallResponse>;
  getConnectionUri(params: {
    project_id: string;
    database_name: string;
    role_name: string;
    branch_id?: string;
    endpoint_id?: string;
    pooled?: boolean;
  }): Promise<MCPToolCallResponse>;
}
