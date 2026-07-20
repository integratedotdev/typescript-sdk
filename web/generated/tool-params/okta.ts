/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface OktaListUsersParams { q?: string; filter?: string; search?: string; limit?: number; after?: string }

export interface OktaGetUserParams { user_id: string }

export interface OktaCreateUserParams { activate?: boolean; user_json: string }

export interface OktaUpdateUserParams { user_id: string; user_json: string }

export interface OktaDeactivateUserParams { user_id: string; sendEmail?: boolean }

export interface OktaListGroupsParams { q?: string; filter?: string; search?: string; limit?: number; after?: string }

export interface OktaGetGroupParams { group_id: string }

export interface OktaCreateGroupParams { group_json: string }

export interface OktaAddUserToGroupParams { group_id: string; user_id: string }

export interface OktaRemoveUserFromGroupParams { group_id: string; user_id: string }

export interface OktaListAppsParams { q?: string; filter?: string; limit?: number; after?: string }

export interface OktaGetAppParams { app_id: string }

export interface OktaListAuthorizationServersParams { q?: string; limit?: number; after?: string }

export interface OktaListPoliciesParams { type?: string; status?: string; limit?: number; after?: string }

export interface OktaListSystemLogsParams { since?: string; until?: string; filter?: string; q?: string; limit?: number; after?: string }

