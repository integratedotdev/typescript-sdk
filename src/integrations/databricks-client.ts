/**
 * Databricks Integration Client Types
 * Typed interface for Databricks workspace REST tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DatabricksIntegrationClient {
  currentUser(params?: { workspace_host?: string }): Promise<MCPToolCallResponse>;
  clustersList(params?: { workspace_host?: string }): Promise<MCPToolCallResponse>;
  clustersGet(params: { cluster_id: string; workspace_host?: string }): Promise<MCPToolCallResponse>;
  jobsList(params?: { limit?: number; offset?: number; name?: string; workspace_host?: string }): Promise<MCPToolCallResponse>;
  jobsGet(params: { job_id: string; workspace_host?: string }): Promise<MCPToolCallResponse>;
  jobsRunNow(params: {
    job_id: string;
    notebook_params?: string;
    workspace_host?: string;
  }): Promise<MCPToolCallResponse>;
  sqlWarehousesList(params?: { workspace_host?: string }): Promise<MCPToolCallResponse>;
  workspaceGetStatus(params: { path: string; workspace_host?: string }): Promise<MCPToolCallResponse>;
}
