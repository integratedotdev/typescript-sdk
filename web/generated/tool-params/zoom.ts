/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZoomGetUserParams { user_id?: string }

export interface ZoomListMeetingsParams {
    user_id?: string;
    type?: string;
    page_size?: number;
    next_page_token?: string;
  }

export interface ZoomCreateMeetingParams {
    topic: string;
    user_id?: string;
    type?: number;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    password?: string;
  }

export interface ZoomGetMeetingParams { meeting_id: string }

export interface ZoomUpdateMeetingParams {
    meeting_id: string;
    topic?: string;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    password?: string;
  }

export interface ZoomDeleteMeetingParams {
    meeting_id: string;
    schedule_for_reminder?: string;
  }

