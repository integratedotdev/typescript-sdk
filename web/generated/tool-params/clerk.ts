/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ClerkListUsersParams {
    limit?: number;
    offset?: number;
    query?: string;
    order_by?: string;
    organization_id?: string;
  }

export interface ClerkGetUserParams { user_id: string }

export interface ClerkCreateUserParams {
    payload?: string;
    email_addresses?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    password?: string;
    skip_password_requirement?: boolean;
  }

export interface ClerkUpdateUserParams { user_id: string; payload: string }

export interface ClerkDeleteUserParams { user_id: string }

export interface ClerkListOrganizationsParams {
    limit?: number;
    offset?: number;
    query?: string;
  }

export interface ClerkGetOrganizationParams { organization_id: string }

export interface ClerkCreateOrganizationParams {
    name: string;
    created_by?: string;
    slug?: string;
  }

export interface ClerkUpdateOrganizationParams {
    organization_id: string;
    payload: string;
  }

export interface ClerkDeleteOrganizationParams { organization_id: string }

export interface ClerkListSessionsParams {
    limit?: number;
    offset?: number;
    user_id?: string;
    status?: string;
  }

export interface ClerkGetSessionParams { session_id: string }

export interface ClerkRevokeSessionParams { session_id: string }

