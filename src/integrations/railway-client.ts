/**
 * Railway Integration Client Types
 * Fully typed interface for Railway integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface RailwayIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getWorkspace(params: { workspace_id: string }): Promise<MCPToolCallResponse>;
  listRegions(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  listProjects(params?: {
    workspace_id?: string;
  }): Promise<MCPToolCallResponse>;
  getProject(params: { project_id: string }): Promise<MCPToolCallResponse>;
  createProject(params: {
    name: string;
    description?: string;
    workspace_id?: string;
    is_public?: boolean;
    pr_deploys?: boolean;
    default_environment_name?: string;
  }): Promise<MCPToolCallResponse>;
  updateProject(params: {
    project_id: string;
    name?: string;
    description?: string;
    is_public?: boolean;
    pr_deploys?: boolean;
  }): Promise<MCPToolCallResponse>;
  deleteProject(params: { project_id: string }): Promise<MCPToolCallResponse>;
  transferProject(params: {
    project_id: string;
    workspace_id: string;
  }): Promise<MCPToolCallResponse>;
  listProjectMembers(params: { project_id: string }): Promise<MCPToolCallResponse>;

  listEnvironments(params: {
    project_id: string;
    is_ephemeral?: boolean;
  }): Promise<MCPToolCallResponse>;
  getEnvironment(params: { environment_id: string }): Promise<MCPToolCallResponse>;
  createEnvironment(params: {
    project_id: string;
    name: string;
    source_environment_id?: string;
    ephemeral?: boolean;
    skip_initial_deploys?: boolean;
    stage_initial_changes?: boolean;
  }): Promise<MCPToolCallResponse>;
  renameEnvironment(params: {
    environment_id: string;
    name: string;
  }): Promise<MCPToolCallResponse>;
  deleteEnvironment(params: { environment_id: string }): Promise<MCPToolCallResponse>;
  getEnvironmentLogs(params: {
    environment_id: string;
    filter?: string;
  }): Promise<MCPToolCallResponse>;
  getEnvironmentStagedChanges(params: { environment_id: string }): Promise<MCPToolCallResponse>;
  commitEnvironmentStagedChanges(params: { environment_id: string }): Promise<MCPToolCallResponse>;

  getService(params: { service_id: string }): Promise<MCPToolCallResponse>;
  getServiceInstance(params: {
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
  createService(params: {
    project_id: string;
    name: string;
    repo?: string;
    image?: string;
    branch?: string;
    icon?: string;
    variables_json?: string;
  }): Promise<MCPToolCallResponse>;
  updateService(params: {
    service_id: string;
    name?: string;
    icon?: string;
  }): Promise<MCPToolCallResponse>;
  updateServiceInstance(params: {
    service_id: string;
    environment_id: string;
    start_command?: string;
    build_command?: string;
    root_directory?: string;
    healthcheck_path?: string;
    healthcheck_timeout?: number;
    region?: string;
    num_replicas?: number;
    restart_policy_type?: string;
    restart_policy_max_retries?: number;
    cron_schedule?: string;
    sleep_application?: boolean;
    dockerfile_path?: string;
  }): Promise<MCPToolCallResponse>;
  connectService(params: {
    service_id: string;
    repo: string;
    branch: string;
  }): Promise<MCPToolCallResponse>;
  disconnectService(params: { service_id: string }): Promise<MCPToolCallResponse>;
  deployService(params: {
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
  redeployService(params: {
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
  getServiceLimits(params: {
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
  deleteService(params: { service_id: string }): Promise<MCPToolCallResponse>;

  listDeployments(params: {
    project_id: string;
    service_id: string;
    environment_id?: string;
    limit?: number;
    successful_only?: boolean;
  }): Promise<MCPToolCallResponse>;
  getDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  getLatestActiveDeployment(params: {
    project_id: string;
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
  getDeploymentBuildLogs(params: {
    deployment_id: string;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
  getDeploymentRuntimeLogs(params: {
    deployment_id: string;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
  getDeploymentHttpLogs(params: {
    deployment_id: string;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
  redeployDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  restartDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  rollbackDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  stopDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  cancelDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;
  removeDeployment(params: { deployment_id: string }): Promise<MCPToolCallResponse>;

  getVariables(params: {
    project_id: string;
    environment_id: string;
    service_id?: string;
  }): Promise<MCPToolCallResponse>;
  getUnrenderedVariables(params: {
    project_id: string;
    environment_id: string;
    service_id?: string;
  }): Promise<MCPToolCallResponse>;
  upsertVariable(params: {
    project_id: string;
    environment_id: string;
    name: string;
    value: string;
    service_id?: string;
    skip_deploys?: boolean;
  }): Promise<MCPToolCallResponse>;
  upsertVariables(params: {
    project_id: string;
    environment_id: string;
    variables_json: string;
    service_id?: string;
    replace?: boolean;
    skip_deploys?: boolean;
  }): Promise<MCPToolCallResponse>;
  deleteVariable(params: {
    project_id: string;
    environment_id: string;
    name: string;
    service_id?: string;
  }): Promise<MCPToolCallResponse>;
  getRenderedVariables(params: {
    project_id: string;
    environment_id: string;
    service_id: string;
  }): Promise<MCPToolCallResponse>;

  listDomains(params: {
    project_id: string;
    environment_id: string;
    service_id: string;
  }): Promise<MCPToolCallResponse>;
  createServiceDomain(params: {
    service_id: string;
    environment_id: string;
    target_port?: number;
  }): Promise<MCPToolCallResponse>;
  deleteServiceDomain(params: { service_domain_id: string }): Promise<MCPToolCallResponse>;
  checkCustomDomainAvailability(params: { domain: string }): Promise<MCPToolCallResponse>;
  createCustomDomain(params: {
    project_id: string;
    environment_id: string;
    service_id: string;
    domain: string;
    target_port?: number;
  }): Promise<MCPToolCallResponse>;
  getCustomDomainStatus(params: {
    custom_domain_id: string;
    project_id: string;
  }): Promise<MCPToolCallResponse>;
  updateCustomDomain(params: {
    custom_domain_id: string;
    environment_id: string;
    target_port?: number;
  }): Promise<MCPToolCallResponse>;
  deleteCustomDomain(params: { custom_domain_id: string }): Promise<MCPToolCallResponse>;

  listProjectVolumes(params: { project_id: string }): Promise<MCPToolCallResponse>;
  getVolumeInstance(params: { volume_instance_id: string }): Promise<MCPToolCallResponse>;
  createVolume(params: {
    project_id: string;
    service_id: string;
    mount_path: string;
    environment_id?: string;
    region?: string;
  }): Promise<MCPToolCallResponse>;
  updateVolume(params: {
    volume_id: string;
    name: string;
  }): Promise<MCPToolCallResponse>;
  updateVolumeInstance(params: {
    volume_id: string;
    mount_path: string;
  }): Promise<MCPToolCallResponse>;
  deleteVolume(params: { volume_id: string }): Promise<MCPToolCallResponse>;
  listVolumeBackups(params: { volume_instance_id: string }): Promise<MCPToolCallResponse>;
  createVolumeBackup(params: { volume_instance_id: string }): Promise<MCPToolCallResponse>;
  restoreVolumeBackup(params: {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }): Promise<MCPToolCallResponse>;
  lockVolumeBackup(params: {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }): Promise<MCPToolCallResponse>;
  deleteVolumeBackup(params: {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }): Promise<MCPToolCallResponse>;
  listVolumeBackupSchedules(params: { volume_instance_id: string }): Promise<MCPToolCallResponse>;

  listTcpProxies(params: {
    service_id: string;
    environment_id: string;
  }): Promise<MCPToolCallResponse>;
}
