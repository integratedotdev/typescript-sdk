/**
 * Figma Integration Client Types
 * Fully typed interface for Figma integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

// ══════════════════════════════════════════════════════════════
// DOMAIN TYPES
// ══════════════════════════════════════════════════════════════

export interface FigmaUser {
  id: string;
  handle: string;
  img_url: string;
  email?: string;
}

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

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  locked?: boolean;
  children?: FigmaNode[];
  backgroundColor?: { r: number; g: number; b: number; a: number };
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  constraints?: { vertical: string; horizontal: string };
}

export interface FigmaComment {
  id: string;
  file_key: string;
  parent_id?: string;
  user: FigmaUser;
  created_at: string;
  resolved_at?: string;
  message: string;
  client_meta: {
    x?: number;
    y?: number;
    node_id?: string;
    node_offset?: { x: number; y: number };
  };
  order_id?: string;
}

export interface FigmaCommentReaction {
  user: FigmaUser;
  created_at: string;
  emoji: string;
}

export interface FigmaProject {
  id: string;
  name: string;
}

export interface FigmaProjectFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

export interface FigmaFileVersion {
  id: string;
  created_at: string;
  label?: string;
  description?: string;
  user: FigmaUser;
}

export interface FigmaComponent {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: FigmaUser;
  containing_frame?: { name: string; nodeId: string };
}

export interface FigmaComponentSet {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: FigmaUser;
  containing_frame?: { name: string; nodeId: string };
}

export interface FigmaStyle {
  key: string;
  file_key: string;
  node_id: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: FigmaUser;
  sort_position: string;
}

export interface FigmaWebhook {
  id: string;
  team_id: string;
  event_type: string;
  client_id: string;
  endpoint: string;
  passcode: string;
  status: "ACTIVE" | "PAUSED";
  description?: string;
  protocol_version: string;
}

export interface FigmaVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: "BOOLEAN" | "FLOAT" | "STRING" | "COLOR";
  valuesByMode: Record<string, any>;
  remote: boolean;
  description: string;
  hiddenFromPublishing: boolean;
  scopes: string[];
  codeSyntax: Record<string, string>;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  key: string;
  modes: Array<{ modeId: string; name: string }>;
  defaultModeId: string;
  remote: boolean;
  hiddenFromPublishing: boolean;
  variableIds: string[];
}

export interface FigmaDevResource {
  id: string;
  name: string;
  url: string;
  file_key: string;
  node_id: string;
  created_at: string;
  updated_at: string;
}

export interface FigmaPaymentStatus {
  user_id: string;
  resource_id: string;
  resource_type: string;
  status: "UNPAID" | "PAID";
}

export interface FigmaLibraryAnalyticsItem {
  component_key?: string;
  component_name?: string;
  style_key?: string;
  style_name?: string;
  actions?: number;
  usages?: number;
  teams?: Array<{ name: string; count: number }>;
  files?: Array<{ name: string; count: number }>;
}

// ══════════════════════════════════════════════════════════════
// CLIENT INTERFACE
// ══════════════════════════════════════════════════════════════

export interface FigmaIntegrationClient {
  // ── Files ─────────────────────────────────────────────────

  /**
   * Get a Figma file by key
   *
   * @example
   * ```typescript
   * const file = await client.figma.getFile({ file_key: "abc123" });
   * ```
   */
  getFile(params: {
    /** Figma file key */
    file_key: string;
    /** Version ID */
    version?: string;
    /** Comma-separated node IDs to fetch */
    ids?: string;
    /** Depth to traverse */
    depth?: number;
    /** Geometry format */
    geometry?: "paths" | "svg";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get specific nodes from a file
   *
   * @example
   * ```typescript
   * const nodes = await client.figma.getFileNodes({ file_key: "abc123", node_ids: "1:5,1:6" });
   * ```
   */
  getFileNodes(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of node IDs */
    node_ids: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get file metadata (name, last modified, version, etc.) without the full document tree
   *
   * @example
   * ```typescript
   * const meta = await client.figma.getFileMeta({ file_key: "abc123" });
   * ```
   */
  getFileMeta(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get URLs of image fills used in a file
   *
   * @example
   * ```typescript
   * const fills = await client.figma.getImageFills({ file_key: "abc123" });
   * ```
   */
  getImageFills(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Export rendered images for nodes in a file
   *
   * @example
   * ```typescript
   * const images = await client.figma.getImages({
   *   file_key: "abc123",
   *   node_ids: "1:5,1:6",
   *   format: "png",
   *   scale: 2
   * });
   * ```
   */
  getImages(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of node IDs to render */
    node_ids: string;
    /** Image format */
    format?: "jpg" | "png" | "svg" | "pdf";
    /** Scale factor (0.01 to 4) */
    scale?: number;
    /** Include node IDs in SVG output */
    svg_include_id?: boolean;
    /** Simplify strokes in SVG output */
    svg_simplify_stroke?: boolean;
    /** Use absolute bounds for cropping */
    use_absolute_bounds?: boolean;
    /** Version ID */
    version?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get version history of a file
   *
   * @example
   * ```typescript
   * const versions = await client.figma.getFileVersions({ file_key: "abc123" });
   * ```
   */
  getFileVersions(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get oEmbed data for a Figma file (embed metadata for external sites)
   *
   * @example
   * ```typescript
   * const embed = await client.figma.getOembed({ file_key: "abc123" });
   * ```
   */
  getOembed(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  // ── Users ─────────────────────────────────────────────────

  /**
   * Get the current authenticated user
   *
   * @example
   * ```typescript
   * const me = await client.figma.getMe();
   * ```
   */
  getMe(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  // ── Comments ──────────────────────────────────────────────

  /**
   * Get comments on a file
   *
   * @example
   * ```typescript
   * const comments = await client.figma.getComments({ file_key: "abc123" });
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
   *   message: "Looks great!",
   *   client_meta_x: 100,
   *   client_meta_y: 200
   * });
   * ```
   */
  postComment(params: {
    /** Figma file key */
    file_key: string;
    /** Comment message text */
    message: string;
    /** Parent comment ID (for replies) */
    comment_id?: string;
    /** Canvas X coordinate for pinned comment */
    client_meta_x?: number;
    /** Canvas Y coordinate for pinned comment */
    client_meta_y?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a comment from a file
   *
   * @example
   * ```typescript
   * await client.figma.deleteComment({ file_key: "abc123", comment_id: "456" });
   * ```
   */
  deleteComment(params: {
    /** Figma file key */
    file_key: string;
    /** Comment ID to delete */
    comment_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get reactions on a comment
   *
   * @example
   * ```typescript
   * const reactions = await client.figma.getCommentReactions({ file_key: "abc123", comment_id: "456" });
   * ```
   */
  getCommentReactions(params: {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a reaction to a comment
   *
   * @example
   * ```typescript
   * await client.figma.postCommentReaction({ file_key: "abc123", comment_id: "456", emoji: "👍" });
   * ```
   */
  postCommentReaction(params: {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
    /** Emoji reaction */
    emoji: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a reaction from a comment
   *
   * @example
   * ```typescript
   * await client.figma.deleteCommentReaction({ file_key: "abc123", comment_id: "456", emoji: "👍" });
   * ```
   */
  deleteCommentReaction(params: {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
    /** Emoji reaction to remove */
    emoji: string;
  }): Promise<MCPToolCallResponse>;

  // ── Projects ──────────────────────────────────────────────

  /**
   * List projects in a team
   *
   * @example
   * ```typescript
   * const projects = await client.figma.listProjects({ team_id: "123456" });
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
   * const files = await client.figma.getProjectFiles({ project_id: "123456" });
   * ```
   */
  getProjectFiles(params: {
    /** Project ID */
    project_id: string;
    /** Whether to include branch data */
    branch_data?: boolean;
  }): Promise<MCPToolCallResponse>;

  // ── Components ────────────────────────────────────────────

  /**
   * Get published components for a team
   *
   * @example
   * ```typescript
   * const components = await client.figma.getTeamComponents({ team_id: "123456" });
   * ```
   */
  getTeamComponents(params: {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get components defined in a file
   *
   * @example
   * ```typescript
   * const components = await client.figma.getFileComponents({ file_key: "abc123" });
   * ```
   */
  getFileComponents(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a single published component by key
   *
   * @example
   * ```typescript
   * const component = await client.figma.getComponent({ key: "component_key" });
   * ```
   */
  getComponent(params: {
    /** Component key */
    key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get published component sets for a team
   *
   * @example
   * ```typescript
   * const sets = await client.figma.getTeamComponentSets({ team_id: "123456" });
   * ```
   */
  getTeamComponentSets(params: {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get component sets defined in a file
   *
   * @example
   * ```typescript
   * const sets = await client.figma.getFileComponentSets({ file_key: "abc123" });
   * ```
   */
  getFileComponentSets(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a single published component set by key
   *
   * @example
   * ```typescript
   * const set = await client.figma.getComponentSet({ key: "set_key" });
   * ```
   */
  getComponentSet(params: {
    /** Component set key */
    key: string;
  }): Promise<MCPToolCallResponse>;

  // ── Styles ────────────────────────────────────────────────

  /**
   * Get published styles for a team
   *
   * @example
   * ```typescript
   * const styles = await client.figma.getTeamStyles({ team_id: "123456" });
   * ```
   */
  getTeamStyles(params: {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get styles defined in a file
   *
   * @example
   * ```typescript
   * const styles = await client.figma.getFileStyles({ file_key: "abc123" });
   * ```
   */
  getFileStyles(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a single published style by key
   *
   * @example
   * ```typescript
   * const style = await client.figma.getStyle({ key: "style_key" });
   * ```
   */
  getStyle(params: {
    /** Style key */
    key: string;
  }): Promise<MCPToolCallResponse>;

  // ── Webhooks ──────────────────────────────────────────────

  /**
   * List all webhooks for the authenticated user
   *
   * @example
   * ```typescript
   * const webhooks = await client.figma.listWebhooks();
   * ```
   */
  listWebhooks(params?: {
    /** Filter by plan API ID */
    plan_api_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a webhook
   *
   * @example
   * ```typescript
   * await client.figma.createWebhook({
   *   event_type: "FILE_UPDATE",
   *   team_id: "123456",
   *   endpoint: "https://example.com/webhook",
   *   passcode: "secret"
   * });
   * ```
   */
  createWebhook(params: {
    /** Event type to subscribe to (e.g. FILE_UPDATE, FILE_VERSION_UPDATE) */
    event_type: string;
    /** Team ID to scope the webhook */
    team_id: string;
    /** URL to receive webhook payloads */
    endpoint: string;
    /** Passcode sent with each payload for verification */
    passcode: string;
    /** Webhook status */
    status?: "ACTIVE" | "PAUSED";
    /** Human-readable description */
    description?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a webhook by ID
   *
   * @example
   * ```typescript
   * const webhook = await client.figma.getWebhook({ webhook_id: "789" });
   * ```
   */
  getWebhook(params: {
    /** Webhook ID */
    webhook_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing webhook
   *
   * @example
   * ```typescript
   * await client.figma.updateWebhook({
   *   webhook_id: "789",
   *   event_type: "FILE_UPDATE",
   *   endpoint: "https://example.com/webhook",
   *   passcode: "new_secret"
   * });
   * ```
   */
  updateWebhook(params: {
    /** Webhook ID */
    webhook_id: string;
    /** Event type to subscribe to */
    event_type: string;
    /** URL to receive webhook payloads */
    endpoint: string;
    /** Passcode sent with each payload */
    passcode: string;
    /** Webhook status */
    status?: "ACTIVE" | "PAUSED";
    /** Human-readable description */
    description?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a webhook
   *
   * @example
   * ```typescript
   * await client.figma.deleteWebhook({ webhook_id: "789" });
   * ```
   */
  deleteWebhook(params: {
    /** Webhook ID */
    webhook_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get all webhooks for a team
   *
   * @example
   * ```typescript
   * const webhooks = await client.figma.getTeamWebhooks({ team_id: "123456" });
   * ```
   */
  getTeamWebhooks(params: {
    /** Team ID */
    team_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get recent delivery requests for a webhook
   *
   * @example
   * ```typescript
   * const requests = await client.figma.getWebhookRequests({ webhook_id: "789" });
   * ```
   */
  getWebhookRequests(params: {
    /** Webhook ID */
    webhook_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Variables ─────────────────────────────────────────────

  /**
   * Get local variables defined in a file
   *
   * @example
   * ```typescript
   * const vars = await client.figma.getLocalVariables({ file_key: "abc123" });
   * ```
   */
  getLocalVariables(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get published variables available to a file
   *
   * @example
   * ```typescript
   * const vars = await client.figma.getPublishedVariables({ file_key: "abc123" });
   * ```
   */
  getPublishedVariables(params: {
    /** Figma file key */
    file_key: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create, update, or delete variables and variable collections in a file
   *
   * @example
   * ```typescript
   * await client.figma.postVariables({
   *   file_key: "abc123",
   *   payload_json: JSON.stringify({ variableCollections: [], variables: [] })
   * });
   * ```
   */
  postVariables(params: {
    /** Figma file key */
    file_key: string;
    /** JSON-encoded variables payload */
    payload_json: string;
  }): Promise<MCPToolCallResponse>;

  // ── Dev Resources ─────────────────────────────────────────

  /**
   * Get dev resources linked to nodes in a file
   *
   * @example
   * ```typescript
   * const resources = await client.figma.getDevResources({ file_key: "abc123" });
   * ```
   */
  getDevResources(params: {
    /** Figma file key */
    file_key: string;
    /** Comma-separated node IDs to filter results */
    node_ids?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create dev resources linked to file nodes
   *
   * @example
   * ```typescript
   * await client.figma.postDevResources({
   *   payload_json: JSON.stringify({ dev_resources: [{ name: "Storybook", url: "...", file_key: "abc123", node_id: "1:5" }] })
   * });
   * ```
   */
  postDevResources(params: {
    /** JSON-encoded dev resources payload */
    payload_json: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update existing dev resources
   *
   * @example
   * ```typescript
   * await client.figma.putDevResources({
   *   payload_json: JSON.stringify({ dev_resources: [{ id: "res123", name: "Updated" }] })
   * });
   * ```
   */
  putDevResources(params: {
    /** JSON-encoded dev resources update payload */
    payload_json: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a dev resource from a file
   *
   * @example
   * ```typescript
   * await client.figma.deleteDevResource({ file_key: "abc123", dev_resource_id: "res123" });
   * ```
   */
  deleteDevResource(params: {
    /** Figma file key */
    file_key: string;
    /** Dev resource ID to delete */
    dev_resource_id: string;
  }): Promise<MCPToolCallResponse>;

  // ── Payments ──────────────────────────────────────────────

  /**
   * Get payment status for a plugin, widget, or community file.
   * Provide exactly one of: plugin_payment_token, user_id, community_file_id, plugin_id, widget_id.
   *
   * @example
   * ```typescript
   * const payment = await client.figma.getPayments({ plugin_id: "123456789" });
   * ```
   */
  getPayments(params: {
    /** One-time payment token from the plugin */
    plugin_payment_token?: string;
    /** User ID to check payment status for */
    user_id?: string;
    /** Community file ID */
    community_file_id?: string;
    /** Plugin ID */
    plugin_id?: string;
    /** Widget ID */
    widget_id?: string;
  }): Promise<MCPToolCallResponse>;

  // ── Library Analytics ─────────────────────────────────────

  /**
   * Get analytics on component insert/detach actions from a library file
   *
   * @example
   * ```typescript
   * const actions = await client.figma.getLibraryAnalyticsComponentActions({
   *   file_key: "abc123",
   *   group_by: "component"
   * });
   * ```
   */
  getLibraryAnalyticsComponentActions(params: {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by (e.g. "component", "team", "file") */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get analytics on component usages (instances) from a library file
   *
   * @example
   * ```typescript
   * const usages = await client.figma.getLibraryAnalyticsComponentUsages({
   *   file_key: "abc123",
   *   group_by: "component"
   * });
   * ```
   */
  getLibraryAnalyticsComponentUsages(params: {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get analytics on style insert/detach actions from a library file
   *
   * @example
   * ```typescript
   * const actions = await client.figma.getLibraryAnalyticsStyleActions({
   *   file_key: "abc123",
   *   group_by: "style"
   * });
   * ```
   */
  getLibraryAnalyticsStyleActions(params: {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }): Promise<MCPToolCallResponse>;

  /**
   * Get analytics on style usages from a library file
   *
   * @example
   * ```typescript
   * const usages = await client.figma.getLibraryAnalyticsStyleUsages({
   *   file_key: "abc123",
   *   group_by: "style"
   * });
   * ```
   */
  getLibraryAnalyticsStyleUsages(params: {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }): Promise<MCPToolCallResponse>;
}
