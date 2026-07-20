/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface OutlookListMessagesParams {
    /** Number of messages to return */
    top?: number;
    /** Number of messages to skip */
    skip?: number;
    /** OData filter expression */
    filter?: string;
    /** OData select fields */
    select?: string;
    /** Folder ID or well-known name (inbox, drafts, sentitems, deleteditems) */
    folder_id?: string;
  }

export interface OutlookGetMessageParams {
    /** Message ID */
    message_id: string;
  }

export interface OutlookSendMessageParams {
    /** Comma-separated recipient email addresses */
    to: string;
    /** Email subject */
    subject: string;
    /** Email body content */
    body: string;
    /** Body content type */
    body_type?: "text" | "html";
    /** Comma-separated CC email addresses */
    cc?: string;
    /** Comma-separated BCC email addresses */
    bcc?: string;
  }

export interface OutlookSearchMessagesParams {
    /** Search query string */
    query: string;
    /** Maximum number of results to return */
    top?: number;
  }

export interface OutlookReplyMessageParams {
    /** Message ID to reply to */
    message_id: string;
    /** Reply comment text */
    comment: string;
  }

export interface OutlookReplyAllMessageParams {
    /** Message ID to reply all to */
    message_id: string;
    /** Reply comment text */
    comment: string;
  }

export interface OutlookForwardMessageParams {
    /** Message ID to forward */
    message_id: string;
    /** Comma-separated recipient email addresses */
    to: string;
    /** Optional comment to include with the forward */
    comment?: string;
  }

export interface OutlookDeleteMessageParams {
    /** Message ID to delete */
    message_id: string;
  }

export interface OutlookMoveMessageParams {
    /** Message ID to move */
    message_id: string;
    /** Destination folder ID or well-known name (inbox, drafts, sentitems, deleteditems) */
    destination_id: string;
  }

export interface OutlookMarkMessageReadParams {
    /** Message ID */
    message_id: string;
    /** True to mark as read, false to mark as unread */
    is_read: boolean;
  }

export interface OutlookCreateDraftParams {
    /** Email subject */
    subject: string;
    /** Email body content */
    body: string;
    /** Comma-separated recipient email addresses */
    to?: string;
    /** Comma-separated CC email addresses */
    cc?: string;
    /** Comma-separated BCC email addresses */
    bcc?: string;
    /** Body content type */
    body_type?: "text" | "html";
  }

export interface OutlookListMailFoldersParams {
    /** Number of folders to return */
    top?: number;
    /** Whether to include hidden folders */
    include_hidden_folders?: boolean;
  }

export interface OutlookListEventsParams {
    /** Number of events to return */
    top?: number;
    /** Start of time range (ISO 8601) */
    start_datetime?: string;
    /** End of time range (ISO 8601) */
    end_datetime?: string;
    /** OData filter expression */
    filter?: string;
  }

export interface OutlookGetEventParams {
    /** Event ID */
    event_id: string;
  }

export interface OutlookCreateEventParams {
    /** Event subject/title */
    subject: string;
    /** Start datetime (ISO 8601) */
    start: string;
    /** End datetime (ISO 8601) */
    end: string;
    /** Timezone for start/end (e.g. "America/Los_Angeles") */
    timezone?: string;
    /** Event body/description */
    body?: string;
    /** Event location */
    location?: string;
    /** Comma-separated attendee email addresses */
    attendees?: string;
    /** Whether to create a Teams online meeting */
    is_online_meeting?: boolean;
  }

export interface OutlookUpdateEventParams {
    /** Event ID to update */
    event_id: string;
    /** New subject/title */
    subject?: string;
    /** New start datetime (ISO 8601) */
    start?: string;
    /** New end datetime (ISO 8601) */
    end?: string;
    /** Timezone for start/end */
    timezone?: string;
    /** New body/description */
    body?: string;
    /** New location */
    location?: string;
    /** Comma-separated attendee email addresses */
    attendees?: string;
  }

export interface OutlookDeleteEventParams {
    /** Event ID to delete */
    event_id: string;
  }

export interface OutlookAcceptEventParams {
    /** Event ID to accept */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }

export interface OutlookDeclineEventParams {
    /** Event ID to decline */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }

export interface OutlookTentativelyAcceptEventParams {
    /** Event ID to tentatively accept */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }

export interface OutlookFindMeetingTimesParams {
    /** Comma-separated attendee email addresses */
    attendees: string;
    /** Required meeting duration in minutes */
    duration_minutes: number;
    /** Start of search window (ISO 8601) */
    time_constraint_start?: string;
    /** End of search window (ISO 8601) */
    time_constraint_end?: string;
    /** Timezone for the results */
    timezone?: string;
  }

export interface OutlookGetScheduleParams {
    /** Comma-separated email addresses to fetch schedules for */
    schedules: string;
    /** Start of the time window (ISO 8601) */
    start_time: string;
    /** End of the time window (ISO 8601) */
    end_time: string;
    /** Timezone for start/end times */
    timezone?: string;
    /** Granularity of availability view in minutes (default: 30) */
    availability_view_interval?: number;
  }

export interface OutlookListContactsParams {
    /** Number of contacts to return */
    top?: number;
    /** Number of contacts to skip */
    skip?: number;
    /** OData filter expression */
    filter?: string;
    /** OData select fields */
    select?: string;
  }

export interface OutlookGetContactParams {
    /** Contact ID */
    contact_id: string;
  }

