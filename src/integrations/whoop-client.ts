import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WhoopIntegrationClient {
  getProfile(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getBodyMeasurement(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listCycles(params: { "start"?: string; "end"?: string; "limit"?: number; "nextToken"?: string }): Promise<MCPToolCallResponse>;
  listRecovery(params: { "start"?: string; "end"?: string; "limit"?: number; "nextToken"?: string }): Promise<MCPToolCallResponse>;
  listSleep(params: { "start"?: string; "end"?: string; "limit"?: number; "nextToken"?: string }): Promise<MCPToolCallResponse>;
  listWorkouts(params: { "start"?: string; "end"?: string; "limit"?: number; "nextToken"?: string }): Promise<MCPToolCallResponse>;
}
