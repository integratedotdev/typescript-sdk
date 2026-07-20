/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AsanaListWorkspacesParams { limit?: number; offset?: string }

export interface AsanaListProjectsParams { workspace?: string; team?: string; archived?: boolean; limit?: number; offset?: string }

export interface AsanaGetProjectParams { project_gid: string }

export interface AsanaCreateProjectParams { project_json: string }

export interface AsanaUpdateProjectParams { project_gid: string; project_json: string }

export interface AsanaListSectionsParams { project_gid: string; limit?: number; offset?: string }

export interface AsanaListTasksParams { workspace?: string; project?: string; section?: string; assignee?: string; completed_since?: string; modified_since?: string; limit?: number; offset?: string }

export interface AsanaGetTaskParams { task_gid: string }

export interface AsanaCreateTaskParams { task_json: string }

export interface AsanaUpdateTaskParams { task_gid: string; task_json: string }

export interface AsanaDeleteTaskParams { task_gid: string }

export interface AsanaListStoriesParams { task_gid: string; limit?: number; offset?: string }

export interface AsanaCreateStoryParams { task_gid: string; story_json: string }

export interface AsanaListUsersParams { workspace?: string; team?: string; limit?: number; offset?: string }

export interface AsanaListTeamsParams { workspace_gid: string; limit?: number; offset?: string }

