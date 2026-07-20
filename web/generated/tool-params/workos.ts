/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface WorkosListOrganizationsParams {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    search?: string;
    domains?: string;
  }

export interface WorkosGetOrganizationParams { organization_id: string }

export interface WorkosCreateOrganizationParams {
    name: string;
    external_id?: string;
    allow_profiles_outside_organization?: boolean;
    metadata_json?: string;
    domain_data_json?: string;
  }

export interface WorkosUpdateOrganizationParams {
    organization_id: string;
    name?: string;
    external_id?: string;
    allow_profiles_outside_organization?: boolean;
    metadata_json?: string;
  }

export interface WorkosListUsersParams {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    organization_id?: string;
    email?: string;
  }

export interface WorkosGetUserParams { user_id: string }

export interface WorkosListOrganizationMembershipsParams {
    organization_id?: string;
    user_id?: string;
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    statuses?: string;
  }

export interface WorkosListDirectoriesParams {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    organization_id?: string;
    search?: string;
    domain?: string;
  }

export interface WorkosGetDirectoryParams { directory_id: string }

export interface WorkosListDirectoryUsersParams {
    directory?: string;
    group?: string;
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
  }

export interface WorkosGetDirectoryUserParams { directory_user_id: string }

