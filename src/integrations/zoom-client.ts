/**
 * Zoom Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZoomIntegrationClient {
  getUser(params?: { user_id?: string }): Promise<MCPToolCallResponse>;

  listMeetings(params?: {
    user_id?: string;
    type?: string;
    page_size?: number;
    next_page_token?: string;
  }): Promise<MCPToolCallResponse>;

  createMeeting(params: {
    topic: string;
    user_id?: string;
    type?: number;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    password?: string;
  }): Promise<MCPToolCallResponse>;

  getMeeting(params: { meeting_id: string }): Promise<MCPToolCallResponse>;

  updateMeeting(params: {
    meeting_id: string;
    topic?: string;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    password?: string;
  }): Promise<MCPToolCallResponse>;

  deleteMeeting(params: {
    meeting_id: string;
    schedule_for_reminder?: string;
  }): Promise<MCPToolCallResponse>;
}
