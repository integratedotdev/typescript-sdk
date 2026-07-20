/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleCalendarListCalendarsParams {
    /** Maximum number of entries returned */
    maxResults?: number;
    /** Token for pagination */
    pageToken?: string;
    /** Whether to include deleted calendars */
    showDeleted?: boolean;
    /** Whether to show hidden calendars */
    showHidden?: boolean;
  }

export interface GoogleCalendarGetCalendarParams {
    /** Calendar ID (use 'primary' for the user's primary calendar) */
    calendarId: string;
  }

export interface GoogleCalendarListEventsParams {
    /** Calendar ID */
    calendarId: string;
    /** Lower bound for event's end time (ISO 8601) */
    timeMin?: string;
    /** Upper bound for event's start time (ISO 8601) */
    timeMax?: string;
    /** Maximum number of events returned */
    maxResults?: number;
    /** Token for pagination */
    pageToken?: string;
    /** Free text search terms */
    q?: string;
    /** Whether to include deleted events */
    showDeleted?: boolean;
    /** Whether to expand recurring events */
    singleEvents?: boolean;
    /** Order of events returned */
    orderBy?: "startTime" | "updated";
  }

export interface GoogleCalendarGetEventParams {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
    /** Time zone for the response */
    timeZone?: string;
  }

export interface GoogleCalendarCreateEventParams {
    /** Calendar ID */
    calendarId: string;
    /** Event summary/title */
    summary: string;
    /** Event description */
    description?: string;
    /** Event location */
    location?: string;
    /** Event start time */
    start: {
      /** All-day event date (yyyy-MM-dd) */
      date?: string;
      /** Event start datetime (RFC 3339) */
      dateTime?: string;
      /** Time zone */
      timeZone?: string;
    };
    /** Event end time */
    end: {
      /** All-day event end date (yyyy-MM-dd) */
      date?: string;
      /** Event end datetime (RFC 3339) */
      dateTime?: string;
      /** Time zone */
      timeZone?: string;
    };
    /** Attendees to invite */
    attendees?: Array<{
      email: string;
      displayName?: string;
      optional?: boolean;
    }>;
    /** Whether to send notifications to attendees */
    sendUpdates?: "all" | "externalOnly" | "none";
    /** Recurrence rules (RRULE format) */
    recurrence?: string[];
    /** Whether to create a conference */
    conferenceDataVersion?: 0 | 1;
  }

export interface GoogleCalendarUpdateEventParams {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
    /** Event summary/title */
    summary?: string;
    /** Event description */
    description?: string;
    /** Event location */
    location?: string;
    /** Event start time */
    start?: {
      date?: string;
      dateTime?: string;
      timeZone?: string;
    };
    /** Event end time */
    end?: {
      date?: string;
      dateTime?: string;
      timeZone?: string;
    };
    /** Attendees */
    attendees?: Array<{
      email: string;
      displayName?: string;
      optional?: boolean;
    }>;
    /** Whether to send notifications */
    sendUpdates?: "all" | "externalOnly" | "none";
  }

export interface GoogleCalendarDeleteEventParams {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
    /** Whether to send notifications */
    sendUpdates?: "all" | "externalOnly" | "none";
  }

export interface GoogleCalendarListAttendeesParams {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
  }

export interface GoogleCalendarQuickAddParams {
    /** Calendar ID */
    calendarId: string;
    /** Text describing the event in natural language */
    text: string;
    /** Whether to send notifications */
    sendUpdates?: "all" | "externalOnly" | "none";
  }

export interface GoogleCalendarCreateCalendarParams {
    summary: string;
    description?: string;
    timezone?: string;
  }

export interface GoogleCalendarDeleteCalendarParams {
    calendar_id: string;
  }

export interface GoogleCalendarFreebusyParams {
    calendar_ids: string;
    time_min: string;
    time_max: string;
    timezone?: string;
  }

