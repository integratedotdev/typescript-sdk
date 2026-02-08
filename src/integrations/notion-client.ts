/**
 * Notion Integration Client Types
 * Fully typed interface for Notion integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Notion Rich Text Object
 */
export interface NotionRichText {
  type: "text" | "mention" | "equation";
  text?: { content: string; link?: { url: string } | null };
  mention?: Record<string, any>;
  equation?: { expression: string };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

/**
 * Notion Page Object
 */
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  icon?: {
    type: "emoji" | "external" | "file";
    emoji?: string;
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  cover?: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  properties: Record<string, any>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "workspace"; workspace: true };
  url: string;
}

/**
 * Notion Database Object
 */
export interface NotionDatabase {
  id: string;
  created_time: string;
  last_edited_time: string;
  title: Array<NotionRichText>;
  description: Array<NotionRichText>;
  icon?: {
    type: "emoji" | "external" | "file";
    emoji?: string;
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  cover?: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  properties: Record<string, any>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "workspace"; workspace: true };
  url: string;
  archived: boolean;
}

/**
 * Notion Block Object
 */
export interface NotionBlock {
  id: string;
  type: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  [key: string]: any;
}

/**
 * Notion User Object
 */
export interface NotionUser {
  id: string;
  type: "person" | "bot";
  name?: string;
  avatar_url?: string;
  person?: { email: string };
  bot?: Record<string, any>;
}

/**
 * Notion Comment Object
 */
export interface NotionComment {
  id: string;
  parent: { type: "page_id"; page_id: string } | { type: "block_id"; block_id: string };
  discussion_id: string;
  created_time: string;
  last_edited_time: string;
  created_by: { id: string };
  rich_text: Array<NotionRichText>;
}

/**
 * Notion Search Result
 */
export interface NotionSearchResult {
  object: "page" | "database";
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  url: string;
  // Additional properties based on object type
  [key: string]: any;
}

/**
 * Notion File Upload Object
 */
export interface NotionFileUpload {
  id: string;
  status: "uploaded" | "importing" | "ready" | "failed";
  filename: string;
  content_type?: string;
  created_time: string;
  [key: string]: any;
}

/**
 * Notion Data Source Object
 */
export interface NotionDataSource {
  id: string;
  title: Array<NotionRichText>;
  description?: Array<NotionRichText>;
  icon?: {
    type: "emoji" | "external" | "file";
    emoji?: string;
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  properties: Record<string, any>;
  parent: { type: "page_id"; page_id: string };
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  in_trash: boolean;
}

/**
 * Notion Integration Client Interface
 * Provides type-safe methods for all Notion operations
 */
export interface NotionIntegrationClient {
  // ──── Search ────

  /**
   * Search for pages and databases in Notion
   *
   * @example
   * ```typescript
   * const results = await client.notion.search({
   *   query: "Project Planning",
   *   filter: { property: "object", value: "page" },
   *   sort: { direction: "descending", timestamp: "last_edited_time" }
   * });
   * ```
   */
  search(params?: {
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
  }): Promise<MCPToolCallResponse>;

  // ──── Pages ────

  /**
   * Retrieve a Notion page by ID
   */
  getPage(params: {
    /** The ID of the page to retrieve */
    page_id: string;
    /** Filter the properties returned (optional) */
    filter_properties?: string[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new page under a page or database parent
   */
  createPage(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a page's properties, icon, cover, or archive status
   */
  updatePage(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific property value from a page with pagination support
   */
  getPageProperty(params: {
    /** The ID of the page */
    page_id: string;
    /** The ID of the property to retrieve */
    property_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }): Promise<MCPToolCallResponse>;

  // ──── Databases ────

  /**
   * Get a database by ID including its schema
   */
  getDatabase(params: {
    /** The ID of the database to retrieve */
    database_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Query a database with filters, sorts, and pagination
   */
  queryDatabase(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new database under a parent page
   */
  createDatabase(params: {
    /** Parent page for the database */
    parent: { page_id: string };
    /** Database title */
    title: Array<{ text: { content: string } }>;
    /** Database property schema */
    properties: Record<string, any>;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a database's title, description, properties, or archive status
   */
  updateDatabase(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ──── Blocks ────

  /**
   * Get a block by ID
   */
  getBlock(params: {
    /** The ID of the block to retrieve */
    block_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get child blocks of a block with pagination
   */
  getBlockChildren(params: {
    /** The ID of the parent block */
    block_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Append child blocks to a parent block
   */
  appendBlocks(params: {
    /** The ID of the parent block */
    block_id: string;
    /** Array of block objects to append (JSON) */
    children: Record<string, any>[];
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a block's content
   */
  updateBlock(params: {
    /** The ID of the block to update */
    block_id: string;
    /** Block content update (JSON, keyed by block type) */
    [key: string]: any;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete (archive) a block
   */
  deleteBlock(params: {
    /** The ID of the block to delete */
    block_id: string;
  }): Promise<MCPToolCallResponse>;

  // ──── Users ────

  /**
   * Get a user by ID
   */
  getUser(params: {
    /** The ID of the user to retrieve */
    user_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the bot user associated with the current token
   */
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * List workspace users with pagination
   */
  listUsers(params?: {
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }): Promise<MCPToolCallResponse>;

  // ──── Comments ────

  /**
   * Create a comment on a page or reply to a discussion
   */
  createComment(params: {
    /** Parent page to comment on (use this or discussion_id) */
    parent?: { page_id: string };
    /** Discussion thread to reply to (use this or parent) */
    discussion_id?: string;
    /** Comment content as rich text */
    rich_text: Array<{ text: { content: string } }>;
  }): Promise<MCPToolCallResponse>;

  /**
   * List comments on a block or page
   */
  listComments(params: {
    /** The ID of the block or page */
    block_id: string;
    /** Start cursor for pagination */
    start_cursor?: string;
    /** Page size for pagination */
    page_size?: number;
  }): Promise<MCPToolCallResponse>;

  // ──── Page Move ────

  /**
   * Move a page to a new parent page or data source
   */
  movePage(params: {
    /** Notion page ID to move */
    page_id: string;
    /** Type of the new parent: "page_id" or "data_source_id" */
    parent_type: "page_id" | "data_source_id";
    /** ID of the new parent */
    parent_id: string;
  }): Promise<MCPToolCallResponse>;

  // ──── File Uploads ────

  /**
   * Create a Notion file upload. Use mode "external_url" to import from a URL,
   * or "single_part" to upload file content.
   *
   * @example
   * ```typescript
   * // External URL (1 step)
   * const upload = await client.notion.createFileUpload({
   *   mode: "external_url",
   *   filename: "logo.png",
   *   content_type: "image/png",
   *   external_url: "https://example.com/logo.png"
   * });
   *
   * // Single part (then call sendFileUpload + completeFileUpload)
   * const upload = await client.notion.createFileUpload({
   *   mode: "single_part",
   *   filename: "report.pdf",
   *   content_type: "application/pdf"
   * });
   * ```
   */
  createFileUpload(params: {
    /** Upload mode: "external_url" to import from URL, "single_part" to upload content */
    mode: "external_url" | "single_part";
    /** Name of the file */
    filename: string;
    /** MIME type of the file (e.g. "image/png", "text/plain") */
    content_type?: string;
    /** URL to import from — required when mode is "external_url" */
    external_url?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send file content for a Notion file upload (single_part mode).
   * Content must be base64-encoded.
   */
  sendFileUpload(params: {
    /** File upload ID (from createFileUpload response) */
    upload_id: string;
    /** Base64-encoded file content */
    file_content_base64: string;
    /** Name of the file */
    filename: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Complete a Notion file upload after sending content
   */
  completeFileUpload(params: {
    /** File upload ID */
    upload_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the status of a Notion file upload
   */
  getFileUpload(params: {
    /** File upload ID */
    upload_id: string;
  }): Promise<MCPToolCallResponse>;

  // ──── Data Sources ────

  /**
   * Create a new Notion data source under a parent page
   *
   * @example
   * ```typescript
   * const ds = await client.notion.createDataSource({
   *   parent_id: "page-abc123",
   *   title: "Sales Tracker",
   *   properties: '{"Name":{"type":"title","title":{}},"Amount":{"type":"number","number":{"format":"dollar"}}}',
   *   description: "Track monthly sales",
   *   icon_emoji: "📊"
   * });
   * ```
   */
  createDataSource(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a Notion data source by its ID
   */
  getDataSource(params: {
    /** Notion data source ID */
    data_source_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update a Notion data source's title, description, properties, or status
   */
  updateDataSource(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Query a Notion data source with optional filters, sorts, and pagination
   *
   * @example
   * ```typescript
   * const results = await client.notion.queryDataSource({
   *   data_source_id: "ds-abc123",
   *   filter: '{"property":"Status","select":{"equals":"Done"}}',
   *   sorts: '[{"property":"Created","direction":"descending"}]',
   *   page_size: 25
   * });
   * ```
   */
  queryDataSource(params: {
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
  }): Promise<MCPToolCallResponse>;
}
