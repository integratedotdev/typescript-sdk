/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface Auth0ListUsersParams {
    q?: string;
    page?: number;
    per_page?: number;
    include_totals?: boolean;
  }

export interface Auth0GetUserParams { user_id: string }

export interface Auth0CreateUserParams {
    connection: string;
    email: string;
    password: string;
    name?: string;
  }

export interface Auth0PatchUserParams { user_id: string; patch_json: string }

export interface Auth0DeleteUserParams { user_id: string }

export interface Auth0ListConnectionsParams {
    strategy?: string;
    fields?: string;
    include_fields?: boolean;
  }

export interface Auth0GetConnectionParams { connection_id: string; fields?: string }

export interface Auth0ListClientsParams {
    page?: number;
    per_page?: number;
    is_global?: boolean;
    is_first_party?: boolean;
  }

export interface Auth0GetClientParams { client_id: string; fields?: string }

export interface Auth0CreateClientParams { client_json: string }

export interface Auth0PatchClientParams { client_id: string; patch_json: string }

