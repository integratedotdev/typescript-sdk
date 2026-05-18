import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FitbitIntegrationClient {
  getProfile(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listActivities(params: { date: string }): Promise<MCPToolCallResponse>;
  listSleep(params: { date: string }): Promise<MCPToolCallResponse>;
  listHeartRate(params: { date: string }): Promise<MCPToolCallResponse>;
  listWeight(params: { date: string }): Promise<MCPToolCallResponse>;
  logActivity(params: { activity_json: string }): Promise<MCPToolCallResponse>;
}
