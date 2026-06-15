import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleAnalyticsIntegrationClient {
  batchRunReports(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getProperty(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listAccountSummaries(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  runRealtimeReport(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  runReport(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
