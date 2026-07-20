/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PostmanListWorkspacesParams { type?: string; created_by?: string }

export interface PostmanGetWorkspaceParams { workspace_id: string }

export interface PostmanListCollectionsParams { workspace?: string }

export interface PostmanGetCollectionParams { collection_uid: string }

export interface PostmanDeleteCollectionParams { collection_uid: string }

export interface PostmanListEnvironmentsParams { workspace?: string }

export interface PostmanGetEnvironmentParams { environment_uid: string }

export interface PostmanCreateCollectionParams { workspace: string; collection: string }

