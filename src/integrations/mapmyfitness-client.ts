import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MapmyfitnessIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkouts(params: { "user"?: string; "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  getWorkout(params: { workout_id: string }): Promise<MCPToolCallResponse>;
  createWorkout(params: { workout_json: string }): Promise<MCPToolCallResponse>;
  listRoutes(params: { "user"?: string; "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
}
