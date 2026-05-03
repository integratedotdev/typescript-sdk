/**
 * Word Integration Client Types
 * Fully typed interface for Word document methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Word Integration Client Interface
 * Provides type-safe methods for managing Word documents in OneDrive
 */
export interface WordIntegrationClient {
  /**
   * Search for Word documents
   *
   * @example
   * ```typescript
   * const docs = await client.word.list({ query: "report" });
   * ```
   */
  list(params?: {
    /** Filter by name (default: searches .docx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get metadata for a Word document
   *
   * @example
   * ```typescript
   * const doc = await client.word.get({ item_id: "ABC123" });
   * ```
   */
  get(params: {
    /** Document item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new empty .docx file in OneDrive
   *
   * @example
   * ```typescript
   * const doc = await client.word.create({ name: "Meeting Notes" });
   * ```
   */
  create(params: {
    /** File name (.docx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  updateContent(params: {
    /** Document item ID */
    item_id: string;
    /** Base64-encoded .docx bytes */
    content: string;
    /** MIME type override */
    content_type?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Copy a Word document
   *
   * For large files the API returns `{ status: "pending", monitor_url }` — poll
   * `monitor_url` until it returns a DriveItem to confirm completion.
   *
   * @example
   * ```typescript
   * const copy = await client.word.copy({ item_id: "ABC123", name: "Notes Copy" });
   * ```
   */
  copy(params: {
    /** Document item ID to copy */
    item_id: string;
    /** Name for the copy */
    name?: string;
    /** Destination folder item ID */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a Word document permanently
   *
   * @example
   * ```typescript
   * await client.word.delete({ item_id: "ABC123" });
   * ```
   */
  delete(params: {
    /** Document item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a sharing link for a Word document
   *
   * @example
   * ```typescript
   * const link = await client.word.share({ item_id: "ABC123", type: "edit" });
   * ```
   */
  share(params: {
    /** Document item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }): Promise<MCPToolCallResponse>;
}
