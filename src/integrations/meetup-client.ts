import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MeetupIntegrationClient {
  getSelf(params: Record<string, never>): Promise<MCPToolCallResponse>;
  searchGroups(params: { "text"?: string; "location"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  listEvents(params: { urlname: string; "status"?: string; "page"?: number }): Promise<MCPToolCallResponse>;
  getEvent(params: { urlname: string; event_id: string }): Promise<MCPToolCallResponse>;
  createEvent(params: { urlname: string; event_json: string }): Promise<MCPToolCallResponse>;
  rsvpEvent(params: { urlname: string; event_id: string; rsvp_json: string }): Promise<MCPToolCallResponse>;
}
