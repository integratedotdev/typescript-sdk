/**
 * PowerPoint Integration Client Types
 * Fully typed interface for PowerPoint presentation methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * PowerPoint Integration Client Interface
 * Provides type-safe methods for managing PowerPoint files in OneDrive
 */
export interface PowerPointIntegrationClient {
  /**
   * Search for PowerPoint presentations
   *
   * @example
   * ```typescript
   * const presentations = await client.powerpoint.list({ query: "deck" });
   * ```
   */
  list(params?: {
    /** Filter by name (default: searches .pptx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get metadata for a presentation
   *
   * @example
   * ```typescript
   * const ppt = await client.powerpoint.get({ item_id: "ABC123" });
   * ```
   */
  get(params: {
    /** Presentation item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new empty .pptx file in OneDrive
   *
   * @example
   * ```typescript
   * const ppt = await client.powerpoint.create({ name: "Q4 Review" });
   * ```
   */
  create(params: {
    /** File name (.pptx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Copy a presentation
   *
   * For large files the API returns `{ status: "pending", monitor_url }` — poll
   * `monitor_url` until it returns a DriveItem to confirm completion.
   *
   * @example
   * ```typescript
   * const copy = await client.powerpoint.copy({ item_id: "ABC123", name: "Deck Copy" });
   * ```
   */
  copy(params: {
    /** Presentation item ID to copy */
    item_id: string;
    /** Name for the copy */
    name?: string;
    /** Destination folder item ID */
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a presentation permanently
   *
   * @example
   * ```typescript
   * await client.powerpoint.delete({ item_id: "ABC123" });
   * ```
   */
  delete(params: {
    /** Presentation item ID */
    item_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a sharing link for a presentation
   *
   * @example
   * ```typescript
   * const link = await client.powerpoint.share({ item_id: "ABC123", type: "view" });
   * ```
   */
  share(params: {
    /** Presentation item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }): Promise<MCPToolCallResponse>;
}
