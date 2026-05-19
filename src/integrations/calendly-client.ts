import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface CalendlyIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listEventTypes(params: {
    "organization"?: string;
    "user"?: string;
    "count"?: number;
    "page_token"?: string;
  }): Promise<MCPToolCallResponse>;
  getEventType(params: {
    "event_type_uuid": string;
  }): Promise<MCPToolCallResponse>;
  listScheduledEvents(params: {
    "organization"?: string;
    "user"?: string;
    "status"?: string;
    "invitee_email"?: string;
    "min_start_time"?: string;
    "max_start_time"?: string;
    "count"?: number;
    "page_token"?: string;
  }): Promise<MCPToolCallResponse>;
  getScheduledEvent(params: {
    "scheduled_event_uuid": string;
  }): Promise<MCPToolCallResponse>;
  listScheduledEventInvitees(params: {
    "scheduled_event_uuid": string;
    "count"?: number;
    "page_token"?: string;
    "email"?: string;
  }): Promise<MCPToolCallResponse>;
  listAvailabilitySchedules(params: {
    "user"?: string;
  }): Promise<MCPToolCallResponse>;
}
