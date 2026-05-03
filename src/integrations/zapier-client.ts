/**
 * Zapier Integration Client Types
 * Typed methods map to Zapier Partner Workflow API MCP tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZapierIntegrationClient {
  getProfile(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listZaps(params?: {
    limit?: number;
    offset?: number;
    expand?: string;
    include_shared?: boolean;
    inputs?: string;
  }): Promise<MCPToolCallResponse>;
  listApps(params?: {
    category?: string;
    query?: string;
    ids?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
  listActions(params: { app: string; action_type?: string }): Promise<MCPToolCallResponse>;
  listAuthentications(params: { app: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  listZapRuns(params?: {
    zap_id?: number;
    from_date?: string;
    to_date?: string;
    statuses?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
}
