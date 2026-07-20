/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ConfluenceListSpacesParams { cloud_id: string; limit?: number; cursor?: string; keys?: string; type?: string; status?: string }

export interface ConfluenceGetSpaceParams { cloud_id: string; space_id: string }

export interface ConfluenceListPagesParams { cloud_id: string; space_id?: string; status?: string; title?: string; limit?: number; cursor?: string }

export interface ConfluenceGetPageParams { cloud_id: string; page_id: string; "body-format"?: string }

export interface ConfluenceCreatePageParams { cloud_id: string; page_json: string }

export interface ConfluenceUpdatePageParams { cloud_id: string; page_id: string; page_json: string }

export interface ConfluenceDeletePageParams { cloud_id: string; page_id: string }

export interface ConfluenceSearchParams { cloud_id: string; cql: string; limit?: number; start?: number; expand?: string }

export interface ConfluenceListCommentsParams { cloud_id: string; page_id: string; limit?: number; cursor?: string; "body-format"?: string }

export interface ConfluenceCreateCommentParams { cloud_id: string; comment_json: string }

export interface ConfluenceListAttachmentsParams { cloud_id: string; page_id: string; limit?: number; cursor?: string; mediaType?: string; filename?: string }

