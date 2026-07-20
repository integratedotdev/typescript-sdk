/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ContentfulListSpacesParams { "limit"?: number; "skip"?: number }

export interface ContentfulGetSpaceParams { space_id: string }

export interface ContentfulListEntriesParams { space_id: string; environment_id: string; "content_type"?: string; "limit"?: number; "skip"?: number }

export interface ContentfulGetEntryParams { space_id: string; environment_id: string; entry_id: string }

export interface ContentfulCreateEntryParams { space_id: string; environment_id: string; entry_json: string }

export interface ContentfulPublishEntryParams { space_id: string; environment_id: string; entry_id: string }

