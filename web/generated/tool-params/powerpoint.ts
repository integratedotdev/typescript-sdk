/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PowerpointListParams {
    /** Filter by name (default: searches .pptx) */
    query?: string;
    /** Max results (default 25) */
    top?: number;
  }

export interface PowerpointGetParams {
    /** Presentation item ID */
    item_id: string;
  }

export interface PowerpointCreateParams {
    /** File name (.pptx appended automatically if missing) */
    name: string;
    /** Parent folder item ID (defaults to root) */
    parent_id?: string;
  }

export interface PowerpointUpdateContentParams {
    /** Presentation item ID */
    item_id: string;
    /** Base64-encoded .pptx bytes */
    content: string;
    /** MIME type override */
    content_type?: string;
  }

export interface PowerpointCopyParams {
    /** Presentation item ID to copy */
    item_id: string;
    /** Name for the copy */
    name?: string;
    /** Destination folder item ID */
    parent_id?: string;
  }

export interface PowerpointDeleteParams {
    /** Presentation item ID */
    item_id: string;
  }

export interface PowerpointShareParams {
    /** Presentation item ID */
    item_id: string;
    /** view, edit, or embed (default: view) */
    type?: "view" | "edit" | "embed";
    /** anonymous or organization (default: anonymous) */
    scope?: "anonymous" | "organization";
  }

