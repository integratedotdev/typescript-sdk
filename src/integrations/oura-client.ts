import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface OuraIntegrationClient {
  getPersonalInfo(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listDailyActivity(params: { "start_date"?: string; "end_date"?: string; "next_token"?: string }): Promise<MCPToolCallResponse>;
  listSleep(params: { "start_date"?: string; "end_date"?: string; "next_token"?: string }): Promise<MCPToolCallResponse>;
  listWorkouts(params: { "start_date"?: string; "end_date"?: string; "next_token"?: string }): Promise<MCPToolCallResponse>;
  listSessions(params: { "start_date"?: string; "end_date"?: string; "next_token"?: string }): Promise<MCPToolCallResponse>;
  listTags(params: { "start_date"?: string; "end_date"?: string; "next_token"?: string }): Promise<MCPToolCallResponse>;
}
