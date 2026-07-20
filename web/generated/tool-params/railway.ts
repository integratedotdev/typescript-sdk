/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface RailwayGetWorkspaceParams { workspace_id: string }

export interface RailwayListProjectsParams {
    workspace_id?: string;
  }

export interface RailwayGetProjectParams { project_id: string }

export interface RailwayCreateProjectParams {
    name: string;
    description?: string;
    workspace_id?: string;
    is_public?: boolean;
    pr_deploys?: boolean;
    default_environment_name?: string;
  }

export interface RailwayUpdateProjectParams {
    project_id: string;
    name?: string;
    description?: string;
    is_public?: boolean;
    pr_deploys?: boolean;
  }

export interface RailwayDeleteProjectParams { project_id: string }

export interface RailwayTransferProjectParams {
    project_id: string;
    workspace_id: string;
  }

export interface RailwayListProjectMembersParams { project_id: string }

export interface RailwayListEnvironmentsParams {
    project_id: string;
    is_ephemeral?: boolean;
  }

export interface RailwayGetEnvironmentParams { environment_id: string }

export interface RailwayCreateEnvironmentParams {
    project_id: string;
    name: string;
    source_environment_id?: string;
    ephemeral?: boolean;
    skip_initial_deploys?: boolean;
    stage_initial_changes?: boolean;
  }

export interface RailwayRenameEnvironmentParams {
    environment_id: string;
    name: string;
  }

export interface RailwayDeleteEnvironmentParams { environment_id: string }

export interface RailwayGetEnvironmentLogsParams {
    environment_id: string;
    filter?: string;
  }

export interface RailwayGetEnvironmentStagedChangesParams { environment_id: string }

export interface RailwayCommitEnvironmentStagedChangesParams { environment_id: string }

export interface RailwayGetServiceParams { service_id: string }

export interface RailwayGetServiceInstanceParams {
    service_id: string;
    environment_id: string;
  }

export interface RailwayCreateServiceParams {
    project_id: string;
    name: string;
    repo?: string;
    image?: string;
    branch?: string;
    icon?: string;
    variables_json?: string;
  }

export interface RailwayUpdateServiceParams {
    service_id: string;
    name?: string;
    icon?: string;
  }

export interface RailwayUpdateServiceInstanceParams {
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
  }

export interface RailwayConnectServiceParams {
    service_id: string;
    repo: string;
    branch: string;
  }

export interface RailwayDisconnectServiceParams { service_id: string }

export interface RailwayDeployServiceParams {
    service_id: string;
    environment_id: string;
  }

export interface RailwayRedeployServiceParams {
    service_id: string;
    environment_id: string;
  }

export interface RailwayGetServiceLimitsParams {
    service_id: string;
    environment_id: string;
  }

export interface RailwayDeleteServiceParams { service_id: string }

export interface RailwayListDeploymentsParams {
    project_id: string;
    service_id: string;
    environment_id?: string;
    limit?: number;
    successful_only?: boolean;
  }

export interface RailwayGetDeploymentParams { deployment_id: string }

export interface RailwayGetLatestActiveDeploymentParams {
    project_id: string;
    service_id: string;
    environment_id: string;
  }

export interface RailwayGetDeploymentBuildLogsParams {
    deployment_id: string;
    limit?: number;
  }

export interface RailwayGetDeploymentRuntimeLogsParams {
    deployment_id: string;
    limit?: number;
  }

export interface RailwayGetDeploymentHttpLogsParams {
    deployment_id: string;
    limit?: number;
  }

export interface RailwayRedeployDeploymentParams { deployment_id: string }

export interface RailwayRestartDeploymentParams { deployment_id: string }

export interface RailwayRollbackDeploymentParams { deployment_id: string }

export interface RailwayStopDeploymentParams { deployment_id: string }

export interface RailwayCancelDeploymentParams { deployment_id: string }

export interface RailwayRemoveDeploymentParams { deployment_id: string }

export interface RailwayGetVariablesParams {
    project_id: string;
    environment_id: string;
    service_id?: string;
  }

export interface RailwayGetUnrenderedVariablesParams {
    project_id: string;
    environment_id: string;
    service_id?: string;
  }

export interface RailwayUpsertVariableParams {
    project_id: string;
    environment_id: string;
    name: string;
    value: string;
    service_id?: string;
    skip_deploys?: boolean;
  }

export interface RailwayUpsertVariablesParams {
    project_id: string;
    environment_id: string;
    variables_json: string;
    service_id?: string;
    replace?: boolean;
    skip_deploys?: boolean;
  }

export interface RailwayDeleteVariableParams {
    project_id: string;
    environment_id: string;
    name: string;
    service_id?: string;
  }

export interface RailwayGetRenderedVariablesParams {
    project_id: string;
    environment_id: string;
    service_id: string;
  }

export interface RailwayListDomainsParams {
    project_id: string;
    environment_id: string;
    service_id: string;
  }

export interface RailwayCreateServiceDomainParams {
    service_id: string;
    environment_id: string;
    target_port?: number;
  }

export interface RailwayDeleteServiceDomainParams { service_domain_id: string }

export interface RailwayCheckCustomDomainAvailabilityParams { domain: string }

export interface RailwayCreateCustomDomainParams {
    project_id: string;
    environment_id: string;
    service_id: string;
    domain: string;
    target_port?: number;
  }

export interface RailwayGetCustomDomainStatusParams {
    custom_domain_id: string;
    project_id: string;
  }

export interface RailwayUpdateCustomDomainParams {
    custom_domain_id: string;
    environment_id: string;
    target_port?: number;
  }

export interface RailwayDeleteCustomDomainParams { custom_domain_id: string }

export interface RailwayListProjectVolumesParams { project_id: string }

export interface RailwayGetVolumeInstanceParams { volume_instance_id: string }

export interface RailwayCreateVolumeParams {
    project_id: string;
    service_id: string;
    mount_path: string;
    environment_id?: string;
    region?: string;
  }

export interface RailwayUpdateVolumeParams {
    volume_id: string;
    name: string;
  }

export interface RailwayUpdateVolumeInstanceParams {
    volume_id: string;
    mount_path: string;
  }

export interface RailwayDeleteVolumeParams { volume_id: string }

export interface RailwayListVolumeBackupsParams { volume_instance_id: string }

export interface RailwayCreateVolumeBackupParams { volume_instance_id: string }

export interface RailwayRestoreVolumeBackupParams {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }

export interface RailwayLockVolumeBackupParams {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }

export interface RailwayDeleteVolumeBackupParams {
    volume_instance_backup_id: string;
    volume_instance_id: string;
  }

export interface RailwayListVolumeBackupSchedulesParams { volume_instance_id: string }

export interface RailwayListTcpProxiesParams {
    service_id: string;
    environment_id: string;
  }

