import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface EventbriteIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listOrganizations(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listEvents(params: { organization_id: string; "status"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  getEvent(params: { event_id: string }): Promise<MCPToolCallResponse>;
  createEvent(params: { organization_id: string; event_json: string }): Promise<MCPToolCallResponse>;
  listAttendees(params: { event_id: string; "page"?: number }): Promise<MCPToolCallResponse>;
}
