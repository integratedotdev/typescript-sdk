/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface NotionSearchParams {
    /** Text query to search for */
    query?: string;
    /** Filter results by object type */
    filter?: {
      property: "object";
      value: "page" | "database";
    };
    /** Sort results */
    sort?: {
      direction: "ascending" | "descending";
      timestamp: "last_edited_time";
    };
    /** Page size for pagination (default: 100) */
    page_size?: number;
    /** Start cursor for pagination */
    start_cursor?: string;
  }

export interface NotionGetPageParams {
    /** The ID of the page to retrieve */
    page_id: string;
    /** Filter the properties returned (optional) */
    filter_properties?: string[];
  }

export interface NotionCreatePageParams {
    /** Parent page or database */
    parent: { page_id: string } | { database_id: string };
    /** Page properties (required for database parents) */
    properties: Record<string, any>;
    /** Page content as block children (JSON) */
    children?: Record<string, any>[];
    /** Page icon */
    icon?: { type: "emoji"; emoji: string } | { type: "external"; external: { url: string } };
    /** Page cover image */
    cover?: { type: "external"; external: { url: string } };
  }

export interface NotionUpdatePageParams {
    /** The ID of the page to update */
    page_id: string;
    /** Properties to update */
    properties?: Record<string, any>;
    /** Update the page icon */
    icon?: { type: "emoji"; emoji: string } | { type: "external"; external: { url: string } } | null;
    /** Update the page cover */
    cover?: { type: "external"; external: { url: string } } | null;
    /** Archive or unarchive the page */
    archived?: boolean;
  }

export interface NotionGetPagePropertyParams {
    /** The ID of the page */
    page_id: string;
    /** The ID of the property to retrieve */
    property_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }

export interface NotionGetDatabaseParams {
    /** The ID of the database to retrieve */
    database_id: string;
  }

export interface NotionQueryDatabaseParams {
    /** The ID of the database to query */
    database_id: string;
    /** Filter conditions (JSON) */
    filter?: Record<string, any>;
    /** Sort conditions */
    sorts?: Array<{
      property?: string;
      timestamp?: "created_time" | "last_edited_time";
      direction: "ascending" | "descending";
    }>;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }

export interface NotionCreateDatabaseParams {
    /** Parent page for the database */
    parent: { page_id: string };
    /** Database title */
    title: Array<{ text: { content: string } }>;
    /** Database property schema */
    properties: Record<string, any>;
  }

export interface NotionUpdateDatabaseParams {
    /** The ID of the database to update */
    database_id: string;
    /** Update the database title */
    title?: Array<{ text: { content: string } }>;
    /** Update the database description */
    description?: Array<{ text: { content: string } }>;
    /** Update database property schema */
    properties?: Record<string, any>;
    /** Archive or unarchive the database */
    archived?: boolean;
  }

export interface NotionGetBlockParams {
    /** The ID of the block to retrieve */
    block_id: string;
  }

export interface NotionGetBlockChildrenParams {
    /** The ID of the parent block */
    block_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }

export interface NotionAppendBlocksParams {
    /** The ID of the parent block */
    block_id: string;
    /** Array of block objects to append (JSON) */
    children: Record<string, any>[];
  }

export interface NotionUpdateBlockParams {
    /** The ID of the block to update */
    block_id: string;
    /** Block content update (JSON, keyed by block type) */
    [key: string]: any;
  }

export interface NotionDeleteBlockParams {
    /** The ID of the block to delete */
    block_id: string;
  }

export interface NotionGetUserParams {
    /** The ID of the user to retrieve */
    user_id: string;
  }

export interface NotionListUsersParams {
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }

export interface NotionCreateCommentParams {
    /** Parent page to comment on (use this or discussion_id) */
    parent?: { page_id: string };
    /** Discussion thread to reply to (use this or parent) */
    discussion_id?: string;
    /** Comment content as rich text */
    rich_text: Array<{ text: { content: string } }>;
  }

export interface NotionListCommentsParams {
    /** The ID of the block or page */
    block_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }

export interface NotionMovePageParams {
    /** Notion page ID to move */
    page_id: string;
    /** Type of the new parent: "page_id" or "data_source_id" */
    parent_type: "page_id" | "data_source_id";
    /** ID of the new parent */
    parent_id: string;
  }

export interface NotionCreateFileUploadParams {
    /** Upload mode: "external_url" to import from URL, "single_part" to upload content */
    mode: "external_url" | "single_part";
    /** Name of the file */
    filename: string;
    /** MIME type of the file (e.g. "image/png", "text/plain") */
    content_type?: string;
    /** URL to import from — required when mode is "external_url" */
    external_url?: string;
  }

export interface NotionSendFileUploadParams {
    /** File upload ID (from createFileUpload response) */
    upload_id: string;
    /** Base64-encoded file content */
    file_content_base64: string;
    /** Name of the file */
    filename: string;
  }

export interface NotionCompleteFileUploadParams {
    /** File upload ID */
    upload_id: string;
  }

export interface NotionGetFileUploadParams {
    /** File upload ID */
    upload_id: string;
  }

export interface NotionCreateDataSourceParams {
    /** ID of the parent page */
    parent_id: string;
    /** Data source title */
    title: string;
    /** Data source properties schema as JSON string */
    properties: string;
    /** Data source description */
    description?: string;
    /** Emoji icon for the data source */
    icon_emoji?: string;
  }

export interface NotionGetDataSourceParams {
    /** Notion data source ID */
    data_source_id: string;
  }

export interface NotionUpdateDataSourceParams {
    /** Notion data source ID */
    data_source_id: string;
    /** New data source title */
    title?: string;
    /** New data source description */
    description?: string;
    /** Data source properties schema as JSON string */
    properties?: string;
    /** Emoji icon for the data source */
    icon_emoji?: string;
    /** Set to true to archive the data source */
    archived?: boolean;
    /** Set to true to trash the data source */
    in_trash?: boolean;
  }

export interface NotionQueryDataSourceParams {
    /** Notion data source ID */
    data_source_id: string;
    /** Filter as JSON string */
    filter?: string;
    /** Sorts as JSON array string */
    sorts?: string;
    /** Results per page (max 100) */
    page_size?: number;
    /** Pagination cursor */
    start_cursor?: string;
  }

