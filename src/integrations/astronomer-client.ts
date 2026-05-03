/**
 * Astronomer Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AstronomerIntegrationClient {
  getSelf(params?: { create_if_not_exist?: boolean }): Promise<MCPToolCallResponse>;
  listOrganizations(params?: {
    product_plan?: string;
    astronomer_product?: string;
    product?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }): Promise<MCPToolCallResponse>;
  getOrganization(params: {
    organization_id: string;
    is_lookup_only?: boolean;
  }): Promise<MCPToolCallResponse>;
  listWorkspaces(params: {
    organization_id: string;
    workspace_ids?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }): Promise<MCPToolCallResponse>;
  getWorkspace(params: { organization_id: string; workspace_id: string }): Promise<MCPToolCallResponse>;
  listClusters(params: {
    organization_id: string;
    provider?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }): Promise<MCPToolCallResponse>;
  getCluster(params: { organization_id: string; cluster_id: string }): Promise<MCPToolCallResponse>;
  listDeployments(params: {
    organization_id: string;
    workspace_ids?: string;
    deployment_ids?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }): Promise<MCPToolCallResponse>;
  getDeployment(params: { organization_id: string; deployment_id: string }): Promise<MCPToolCallResponse>;
  createDeployment(params: {
    organization_id: string;
    deployment: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;
  updateDeployment(params: {
    organization_id: string;
    deployment_id: string;
    deployment: Record<string, unknown>;
  }): Promise<MCPToolCallResponse>;
  listDeploys(params: {
    organization_id: string;
    deployment_id: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }): Promise<MCPToolCallResponse>;
  getDeploy(params: {
    organization_id: string;
    deployment_id: string;
    deploy_id: string;
  }): Promise<MCPToolCallResponse>;
}
