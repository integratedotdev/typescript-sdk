import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DatadogIntegrationClient {
  listMonitors(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getMonitor(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listDashboards(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getDashboard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  searchLogs(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
