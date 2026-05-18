import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface UniverseIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listEvents(params: { "page"?: number; "per_page"?: number }): Promise<MCPToolCallResponse>;
  getEvent(params: { event_id: string }): Promise<MCPToolCallResponse>;
  createEvent(params: { event_json: string }): Promise<MCPToolCallResponse>;
  listOrders(params: { event_id: string; "page"?: number; "per_page"?: number }): Promise<MCPToolCallResponse>;
  listAttendees(params: { event_id: string; "page"?: number; "per_page"?: number }): Promise<MCPToolCallResponse>;
}
