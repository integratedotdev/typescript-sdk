/**
 * Better Stack Integration Client Types
 * Typed interface for Better Stack Logs / Telemetry API tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BetterStackIntegrationClient {
  listSources(params?: {
    page?: number;
    per_page?: number;
    team_name?: string;
  }): Promise<MCPToolCallResponse>;
  getSource(params: { source_id: string }): Promise<MCPToolCallResponse>;
  createSource(params: {
    name: string;
    platform: string;
    data_region: string;
    source_group_id?: number;
  }): Promise<MCPToolCallResponse>;
  updateSource(params: {
    source_id: string;
    name?: string;
    ingesting_paused?: boolean;
    source_group_id?: number;
    live_tail_pattern?: string;
    logs_retention?: number;
    metrics_retention?: number;
    vrl_transformation?: string;
  }): Promise<MCPToolCallResponse>;
  deleteSource(params: { source_id: string }): Promise<MCPToolCallResponse>;
  listSourceGroups(params?: {
    page?: number;
    per_page?: number;
    team_name?: string;
  }): Promise<MCPToolCallResponse>;
  getSourceGroup(params: { source_group_id: string }): Promise<MCPToolCallResponse>;
  updateSourceGroup(params: {
    source_group_id: string;
    name?: string;
    sort_index?: number;
  }): Promise<MCPToolCallResponse>;
  listCollectors(params?: {
    name?: string;
    team_name?: string;
    page?: number;
    per_page?: number;
  }): Promise<MCPToolCallResponse>;
  listSourceMetrics(params: { source_id: string }): Promise<MCPToolCallResponse>;
  ingestLogs(params: {
    ingesting_host: string;
    source_token: string;
    payload: string;
  }): Promise<MCPToolCallResponse>;
}
