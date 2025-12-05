/**
 * Figma Integration Client Types
 * Fully typed interface for Figma integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Figma File
 */
export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
  document?: {
    id: string;
    name: string;
    type: string;
    children: any[];
  };
  components?: Record<string, {
    key: string;
    name: string;
    description: string;
  }>;
  schemaVersion: number;
  styles?: Record<string, any>;
}

/**
 * Figma Node
 */
export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  locked?: boolean;
  children?: FigmaNode[];
  backgroundColor?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints?: {
    vertical: string;
    horizontal: string;
  };
}

/**
 * Figma Comment
 */
export interface FigmaComment {
  id: string;
  file_key: string;
  parent_id?: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
  created_at: string;
  resolved_at?: string;
  message: string;
  client_meta: {
    x?: number;
    y?: number;
    node_id?: string;
    node_offset?: {
      x: number;
      y: number;
    };
  };
  order_id?: string;
}

/**
 * Figma Project
 */
export interface FigmaProject {
  id: string;
  name: string;
}

/**
 * Figma Project File
 */
export interface FigmaProjectFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

/**
 * Figma File Version
 */
export interface FigmaFileVersion {
  id: string;
  created_at: string;
  label?: string;
  description?: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
}

/**
 * Figma Component
 */
export interface FigmaComponent {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
  containing_frame?: {
    name: string;
    nodeId: string;
  };
}

/**
 * Figma Integration Client Interface
 * Provides type-safe methods for all Figma operations
 */
export interface FigmaIntegrationClient {
  /**
   * Get a Figma file by key
   * 
   * @example
   * ```typescript
   * const file = await client.figma.getFile({
   *   file_key: "abc123"
   * });
   * ```
   */
  getFile(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of version IDs */
    version?: string;
    /** Comma-separated list of node IDs */
    ids?: string;
    /** Depth to traverse (1 or 2) */
    depth?: number;
    /** Geometry format */
    geometry?: "paths" | "svg";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get specific nodes from a file
   * 
   * @example
   * ```typescript
   * const nodes = await client.figma.getFileNodes({
   *   file_key: "abc123",
   *   ids: "1:5,1:6"
   * });
   * ```
   */
  getFileNodes(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of node IDs */
    ids: string;
    /** Version ID */
    version?: string;
    /** Depth to traverse */
    depth?: number;
    /** Geometry format */
    geometry?: "paths" | "svg";
  }): Promise<MCPToolCallResponse>;

  /**
   * Export images from a file
   * 
   * @example
   * ```typescript
   * const images = await client.figma.getImages({
   *   file_key: "abc123",
   *   ids: "1:5,1:6",
   *   format: "png",
   *   scale: 2
   * });
   * ```
   */
  getImages(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of node IDs */
    ids: string;
    /** Image format */
    format?: "jpg" | "png" | "svg" | "pdf";
    /** Scale factor (0.01 to 4) */
    scale?: number;
    /** SVG rendering options */
    svg_include_id?: boolean;
    svg_simplify_stroke?: boolean;
    /** Use absolute bounds */
    use_absolute_bounds?: boolean;
    /** Version ID */
    version?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get comments on a file
   * 
   * @example
   * ```typescript
   * const comments = await client.figma.getComments({
   *   file_key: "abc123"
   * });
   * ```
   */
  getComments(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Post a comment on a file
   * 
   * @example
   * ```typescript
   * await client.figma.postComment({
   *   file_key: "abc123",
   *   message: "Great design!",
   *   client_meta: { x: 100, y: 200 }
   * });
   * ```
   */
  postComment(params: {
    /** Figma file key */
    file_key: string;
    /** Comment message */
    message: string;
    /** Position metadata */
    client_meta?: {
      /** X coordinate */
      x?: number;
      /** Y coordinate */
      y?: number;
      /** Node ID */
      node_id?: string;
      /** Node offset */
      node_offset?: {
        x: number;
        y: number;
      };
    };
    /** Parent comment ID (for replies) */
    comment_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List projects in a team
   * 
   * @example
   * ```typescript
   * const projects = await client.figma.listProjects({
   *   team_id: "123456"
   * });
   * ```
   */
  listProjects(params: {
    /** Team ID */
    team_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get files in a project
   * 
   * @example
   * ```typescript
   * const files = await client.figma.getProjectFiles({
   *   project_id: "123456"
   * });
   * ```
   */
  getProjectFiles(params: {
    /** Project ID */
    project_id: string;
    /** Branch data filter */
    branch_data?: "include" | "exclude";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get version history of a file
   * 
   * @example
   * ```typescript
   * const versions = await client.figma.getFileVersions({
   *   file_key: "abc123"
   * });
   * ```
   */
  getFileVersions(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get published components for a team
   * 
   * @example
   * ```typescript
   * const components = await client.figma.getTeamComponents({
   *   team_id: "123456"
   * });
   * ```
   */
  getTeamComponents(params: {
    /** Team ID */
    team_id: string;
    /** Page size */
    page_size?: number;
    /** Pagination cursor */
    cursor?: string;
  }): Promise<MCPToolCallResponse>;
}
