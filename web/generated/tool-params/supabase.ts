/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SupabaseGetOrganizationParams { slug: string }

export interface SupabaseListOrganizationProjectsParams { slug: string }

export interface SupabaseGetProjectParams { ref: string }

export interface SupabaseCreateProjectParams {
    name: string;
    organization_slug: string;
    db_pass: string;
    region?: string;
    desired_instance_size?: string;
    template_url?: string;
  }

export interface SupabaseUpdateProjectParams { ref: string; name: string }

export interface SupabaseDeleteProjectParams { ref: string }

export interface SupabaseListProjectApiKeysParams { ref: string; reveal?: boolean }

export interface SupabaseCreateProjectApiKeyParams {
    ref: string;
    key_type: string;
    name: string;
    description?: string;
    reveal?: boolean;
  }

export interface SupabaseDeleteProjectApiKeyParams { ref: string; key_id: string }

export interface SupabaseListProjectSecretsParams { ref: string }

export interface SupabaseListProjectBranchesParams { ref: string }

export interface SupabaseGetProjectHealthParams { ref: string }

export interface SupabaseGetDatabasePostgresConfigParams { ref: string }

