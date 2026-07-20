/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface WordpressGetSiteParams { site: string }

export interface WordpressListPostsParams { "number"?: number; "page"?: number; "type"?: string; "status"?: string; site: string }

export interface WordpressGetPostParams { post_id: string; site: string }

export interface WordpressCreatePostParams { post_json: string; site: string }

export interface WordpressUpdatePostParams { post_id: string; post_json: string; site: string }

export interface WordpressListMediaParams { "number"?: number; "page"?: number; site: string }

