/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface FigmaGetFileParams {
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
  }

export interface FigmaGetFileNodesParams {
    /** Figma file key */
    file_key: string;
    /** Comma-separated list of node IDs */
    node_ids: string;
  }

export interface FigmaGetFileMetaParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetImageFillsParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetImagesParams {
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
  }

export interface FigmaGetFileVersionsParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetOembedParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetCommentsParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaPostCommentParams {
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
  }

export interface FigmaDeleteCommentParams {
    /** Figma file key */
    file_key: string;
    /** Comment ID to delete */
    comment_id: string;
  }

export interface FigmaGetCommentReactionsParams {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
  }

export interface FigmaPostCommentReactionParams {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
    /** Emoji reaction */
    emoji: string;
  }

export interface FigmaDeleteCommentReactionParams {
    /** Figma file key */
    file_key: string;
    /** Comment ID */
    comment_id: string;
    /** Emoji reaction to remove */
    emoji: string;
  }

export interface FigmaListProjectsParams {
    /** Team ID */
    team_id: string;
  }

export interface FigmaGetProjectFilesParams {
    /** Project ID */
    project_id: string;
    /** Whether to include branch data */
    branch_data?: boolean;
  }

export interface FigmaGetTeamComponentsParams {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }

export interface FigmaGetFileComponentsParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetComponentParams {
    /** Component key */
    key: string;
  }

export interface FigmaGetTeamComponentSetsParams {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }

export interface FigmaGetFileComponentSetsParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetComponentSetParams {
    /** Component set key */
    key: string;
  }

export interface FigmaGetTeamStylesParams {
    /** Team ID */
    team_id: string;
    /** Number of items per page */
    page_size?: number;
    /** Cursor for next page */
    after?: number;
    /** Cursor for previous page */
    before?: number;
  }

export interface FigmaGetFileStylesParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetStyleParams {
    /** Style key */
    key: string;
  }

export interface FigmaListWebhooksParams {
    /** Filter by plan API ID */
    plan_api_id?: string;
  }

export interface FigmaCreateWebhookParams {
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
  }

export interface FigmaGetWebhookParams {
    /** Webhook ID */
    webhook_id: string;
  }

export interface FigmaUpdateWebhookParams {
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
  }

export interface FigmaDeleteWebhookParams {
    /** Webhook ID */
    webhook_id: string;
  }

export interface FigmaGetTeamWebhooksParams {
    /** Team ID */
    team_id: string;
  }

export interface FigmaGetWebhookRequestsParams {
    /** Webhook ID */
    webhook_id: string;
  }

export interface FigmaGetLocalVariablesParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaGetPublishedVariablesParams {
    /** Figma file key */
    file_key: string;
  }

export interface FigmaPostVariablesParams {
    /** Figma file key */
    file_key: string;
    /** JSON-encoded variables payload */
    payload_json: string;
  }

export interface FigmaGetDevResourcesParams {
    /** Figma file key */
    file_key: string;
    /** Comma-separated node IDs to filter results */
    node_ids?: string;
  }

export interface FigmaPostDevResourcesParams {
    /** JSON-encoded dev resources payload */
    payload_json: string;
  }

export interface FigmaPutDevResourcesParams {
    /** JSON-encoded dev resources update payload */
    payload_json: string;
  }

export interface FigmaDeleteDevResourceParams {
    /** Figma file key */
    file_key: string;
    /** Dev resource ID to delete */
    dev_resource_id: string;
  }

export interface FigmaGetPaymentsParams {
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
  }

export interface FigmaGetLibraryAnalyticsComponentActionsParams {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by (e.g. "component", "team", "file") */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }

export interface FigmaGetLibraryAnalyticsComponentUsagesParams {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }

export interface FigmaGetLibraryAnalyticsStyleActionsParams {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }

export interface FigmaGetLibraryAnalyticsStyleUsagesParams {
    /** Library file key */
    file_key: string;
    /** Dimension to group results by */
    group_by: string;
    /** Pagination cursor */
    cursor?: string;
    /** Sort order */
    order?: "asc" | "desc";
  }

