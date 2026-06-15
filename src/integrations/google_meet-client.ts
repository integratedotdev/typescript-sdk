import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleMeetIntegrationClient {
  addMeetToEvent(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createMeeting(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteMeeting(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getMeeting(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listMeetings(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateMeeting(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
