/**
 * Google Calendar Integration Client Types
 * Fully typed interface for Google Calendar integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Google Calendar
 */
export interface GcalCalendar {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone?: string;
  summaryOverride?: string;
  colorId?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  hidden?: boolean;
  selected?: boolean;
  accessRole: "freeBusyReader" | "reader" | "writer" | "owner";
  defaultReminders?: Array<{
    method: "email" | "popup";
    minutes: number;
  }>;
  primary?: boolean;
}

/**
 * Google Calendar Event
 */
export interface GcalEvent {
  id: string;
  status?: "confirmed" | "tentative" | "cancelled";
  htmlLink?: string;
  created?: string;
  updated?: string;
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  creator?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  organizer?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  start: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  endTimeUnspecified?: boolean;
  recurrence?: string[];
  recurringEventId?: string;
  originalStartTime?: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  transparency?: "opaque" | "transparent";
  visibility?: "default" | "public" | "private" | "confidential";
  iCalUID?: string;
  sequence?: number;
  attendees?: GcalAttendee[];
  attendeesOmitted?: boolean;
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey?: {
        type: string;
      };
      status?: {
        statusCode: string;
      };
    };
    entryPoints?: Array<{
      entryPointType: string;
      uri?: string;
      label?: string;
      pin?: string;
      accessCode?: string;
      meetingCode?: string;
      passcode?: string;
      password?: string;
    }>;
    conferenceSolution?: {
      key?: {
        type: string;
      };
      name?: string;
      iconUri?: string;
    };
    conferenceId?: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: "email" | "popup";
      minutes: number;
    }>;
  };
}

/**
 * Google Calendar Attendee
 */
export interface GcalAttendee {
  id?: string;
  email: string;
  displayName?: string;
  organizer?: boolean;
  self?: boolean;
  resource?: boolean;
  optional?: boolean;
  responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  comment?: string;
  additionalGuests?: number;
}

/**
 * Google Calendar Integration Client Interface
 * Provides type-safe methods for all Google Calendar operations
 */
export interface GcalIntegrationClient {
  /**
   * List calendars
   * 
   * @example
   * ```typescript
   * const calendars = await client.gcal.listCalendars({});
   * ```
   */
  listCalendars(params?: {
    /** Maximum number of entries returned */
    maxResults?: number;
    /** Token for pagination */
    pageToken?: string;
    /** Whether to include deleted calendars */
    showDeleted?: boolean;
    /** Whether to show hidden calendars */
    showHidden?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific calendar
   * 
   * @example
   * ```typescript
   * const calendar = await client.gcal.getCalendar({
   *   calendarId: "primary"
   * });
   * ```
   */
  getCalendar(params: {
    /** Calendar ID (use 'primary' for the user's primary calendar) */
    calendarId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List events in a calendar
   * 
   * @example
   * ```typescript
   * const events = await client.gcal.listEvents({
   *   calendarId: "primary",
   *   timeMin: new Date().toISOString()
   * });
   * ```
   */
  listEvents(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific event
   * 
   * @example
   * ```typescript
   * const event = await client.gcal.getEvent({
   *   calendarId: "primary",
   *   eventId: "event123"
   * });
   * ```
   */
  getEvent(params: {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
    /** Time zone for the response */
    timeZone?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new event
   * 
   * @example
   * ```typescript
   * const event = await client.gcal.createEvent({
   *   calendarId: "primary",
   *   summary: "Team Meeting",
   *   start: { dateTime: "2024-01-15T10:00:00-07:00" },
   *   end: { dateTime: "2024-01-15T11:00:00-07:00" }
   * });
   * ```
   */
  createEvent(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing event
   * 
   * @example
   * ```typescript
   * await client.gcal.updateEvent({
   *   calendarId: "primary",
   *   eventId: "event123",
   *   summary: "Updated Meeting Title"
   * });
   * ```
   */
  updateEvent(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an event
   * 
   * @example
   * ```typescript
   * await client.gcal.deleteEvent({
   *   calendarId: "primary",
   *   eventId: "event123"
   * });
   * ```
   */
  deleteEvent(params: {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
    /** Whether to send notifications */
    sendUpdates?: "all" | "externalOnly" | "none";
  }): Promise<MCPToolCallResponse>;

  /**
   * List attendees for an event
   * 
   * @example
   * ```typescript
   * const attendees = await client.gcal.listAttendees({
   *   calendarId: "primary",
   *   eventId: "event123"
   * });
   * ```
   */
  listAttendees(params: {
    /** Calendar ID */
    calendarId: string;
    /** Event ID */
    eventId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Quickly add an event using natural language
   * 
   * @example
   * ```typescript
   * const event = await client.gcal.quickAdd({
   *   calendarId: "primary",
   *   text: "Meeting with John tomorrow at 3pm"
   * });
   * ```
   */
  quickAdd(params: {
    /** Calendar ID */
    calendarId: string;
    /** Text describing the event in natural language */
    text: string;
    /** Whether to send notifications */
    sendUpdates?: "all" | "externalOnly" | "none";
  }): Promise<MCPToolCallResponse>;
}

