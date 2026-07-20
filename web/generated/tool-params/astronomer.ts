/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AstronomerGetSelfParams { create_if_not_exist?: boolean }

export interface AstronomerListOrganizationsParams {
    product_plan?: string;
    astronomer_product?: string;
    product?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }

export interface AstronomerGetOrganizationParams {
    organization_id: string;
    is_lookup_only?: boolean;
  }

export interface AstronomerListWorkspacesParams {
    organization_id: string;
    workspace_ids?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }

export interface AstronomerGetWorkspaceParams { organization_id: string; workspace_id: string }

export interface AstronomerListClustersParams {
    organization_id: string;
    provider?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }

export interface AstronomerGetClusterParams { organization_id: string; cluster_id: string }

export interface AstronomerListDeploymentsParams {
    organization_id: string;
    workspace_ids?: string;
    deployment_ids?: string;
    names?: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }

export interface AstronomerGetDeploymentParams { organization_id: string; deployment_id: string }

export interface AstronomerCreateDeploymentParams {
    organization_id: string;
    deployment: Record<string, unknown>;
  }

export interface AstronomerUpdateDeploymentParams {
    organization_id: string;
    deployment_id: string;
    deployment: Record<string, unknown>;
  }

export interface AstronomerListDeploysParams {
    organization_id: string;
    deployment_id: string;
    limit?: number;
    offset?: number;
    sorts?: string;
  }

export interface AstronomerGetDeployParams {
    organization_id: string;
    deployment_id: string;
    deploy_id: string;
  }

