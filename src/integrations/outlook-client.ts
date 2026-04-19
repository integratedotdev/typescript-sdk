/**
 * Outlook Integration Client Types
 * Fully typed interface for Microsoft Outlook integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

// ══════════════════════════════════════════════════════════════
// DOMAIN TYPES
// ══════════════════════════════════════════════════════════════

export interface OutlookMessage {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  receivedDateTime: string;
  sentDateTime?: string;
  hasAttachments: boolean;
  internetMessageId?: string;
  subject?: string;
  bodyPreview?: string;
  importance: "low" | "normal" | "high";
  parentFolderId?: string;
  conversationId?: string;
  isRead?: boolean;
  isDraft?: boolean;
  webLink?: string;
  body?: { contentType: "text" | "html"; content: string };
  sender?: { emailAddress: { name?: string; address: string } };
  from?: { emailAddress: { name?: string; address: string } };
  toRecipients?: Array<{ emailAddress: { name?: string; address: string } }>;
  ccRecipients?: Array<{ emailAddress: { name?: string; address: string } }>;
  bccRecipients?: Array<{ emailAddress: { name?: string; address: string } }>;
  flag?: { flagStatus: "notFlagged" | "complete" | "flagged" };
}

export interface OutlookMailFolder {
  id: string;
  displayName: string;
  parentFolderId?: string;
  childFolderCount: number;
  unreadItemCount: number;
  totalItemCount: number;
  isHidden?: boolean;
}

export interface OutlookEvent {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  subject?: string;
  bodyPreview?: string;
  body?: { contentType: "text" | "html"; content: string };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: {
    displayName?: string;
    address?: { street?: string; city?: string; state?: string; countryOrRegion?: string; postalCode?: string };
  };
  isAllDay?: boolean;
  isCancelled?: boolean;
  isOrganizer?: boolean;
  isOnlineMeeting?: boolean;
  onlineMeetingUrl?: string;
  attendees?: Array<{
    emailAddress: { name?: string; address: string };
    type: "required" | "optional" | "resource";
    status?: { response: "none" | "organizer" | "tentativelyAccepted" | "accepted" | "declined" | "notResponded"; time?: string };
  }>;
  organizer?: { emailAddress: { name?: string; address: string } };
  webLink?: string;
  showAs?: "free" | "tentative" | "busy" | "oof" | "workingElsewhere" | "unknown";
}

export interface OutlookCalendar {
  id: string;
  name: string;
  color: string;
  isDefaultCalendar: boolean;
  canShare: boolean;
  canEdit: boolean;
  canViewPrivateItems: boolean;
  owner?: { name?: string; address: string };
}

export interface OutlookMeetingTimeSuggestion {
  meetingTimeSlot: {
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  };
  confidence: number;
  organizerAvailability: string;
  attendeeAvailability: Array<{ attendee: { emailAddress: { name?: string; address: string } }; availability: string }>;
  locations: Array<{ displayName: string }>;
  suggestionReason?: string;
}

export interface OutlookContact {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  companyName?: string;
  department?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  homePhones?: string[];
  emailAddresses?: Array<{ name?: string; address: string }>;
  businessAddress?: { street?: string; city?: string; state?: string; countryOrRegion?: string; postalCode?: string };
  homeAddress?: { street?: string; city?: string; state?: string; countryOrRegion?: string; postalCode?: string };
  birthday?: string;
  personalNotes?: string;
}

// ══════════════════════════════════════════════════════════════
// CLIENT INTERFACE
// ══════════════════════════════════════════════════════════════

export interface OutlookIntegrationClient {
  // ── Email ─────────────────────────────────────────────────

  /**
   * List messages in the mailbox
   *
   * @example
   * ```typescript
   * const messages = await client.outlook.listMessages({ top: 25, filter: "isRead eq false" });
   * ```
   */
  listMessages(params?: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific message by ID
   *
   * @example
   * ```typescript
   * const msg = await client.outlook.getMessage({ message_id: "AAMkAGI2..." });
   * ```
   */
  getMessage(params: {
    /** Message ID */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a new email message
   *
   * @example
   * ```typescript
   * await client.outlook.sendMessage({
   *   to: "alice@example.com,bob@example.com",
   *   subject: "Hello",
   *   body: "Hi there!"
   * });
   * ```
   */
  sendMessage(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Search messages by keyword query
   *
   * @example
   * ```typescript
   * const results = await client.outlook.searchMessages({ query: "project update", top: 10 });
   * ```
   */
  searchMessages(params: {
    /** Search query string */
    query: string;
    /** Maximum number of results to return */
    top?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reply to a message
   *
   * @example
   * ```typescript
   * await client.outlook.replyMessage({ message_id: "AAMkAGI2...", comment: "Thanks!" });
   * ```
   */
  replyMessage(params: {
    /** Message ID to reply to */
    message_id: string;
    /** Reply comment text */
    comment: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reply all to a message
   *
   * @example
   * ```typescript
   * await client.outlook.replyAllMessage({ message_id: "AAMkAGI2...", comment: "Thanks everyone!" });
   * ```
   */
  replyAllMessage(params: {
    /** Message ID to reply all to */
    message_id: string;
    /** Reply comment text */
    comment: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Forward a message to one or more recipients
   *
   * @example
   * ```typescript
   * await client.outlook.forwardMessage({ message_id: "AAMkAGI2...", to: "charlie@example.com" });
   * ```
   */
  forwardMessage(params: {
    /** Message ID to forward */
    message_id: string;
    /** Comma-separated recipient email addresses */
    to: string;
    /** Optional comment to include with the forward */
    comment?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a message permanently
   *
   * @example
   * ```typescript
   * await client.outlook.deleteMessage({ message_id: "AAMkAGI2..." });
   * ```
   */
  deleteMessage(params: {
    /** Message ID to delete */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Move a message to another folder
   *
   * @example
   * ```typescript
   * await client.outlook.moveMessage({ message_id: "AAMkAGI2...", destination_id: "deleteditems" });
   * ```
   */
  moveMessage(params: {
    /** Message ID to move */
    message_id: string;
    /** Destination folder ID or well-known name (inbox, drafts, sentitems, deleteditems) */
    destination_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Mark a message as read or unread
   *
   * @example
   * ```typescript
   * await client.outlook.markMessageRead({ message_id: "AAMkAGI2...", is_read: true });
   * ```
   */
  markMessageRead(params: {
    /** Message ID */
    message_id: string;
    /** True to mark as read, false to mark as unread */
    is_read: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a draft message (not sent)
   *
   * @example
   * ```typescript
   * await client.outlook.createDraft({ subject: "Draft email", body: "Work in progress..." });
   * ```
   */
  createDraft(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * List mail folders in the mailbox
   *
   * @example
   * ```typescript
   * const folders = await client.outlook.listMailFolders();
   * ```
   */
  listMailFolders(params?: {
    /** Number of folders to return */
    top?: number;
    /** Whether to include hidden folders */
    include_hidden_folders?: boolean;
  }): Promise<MCPToolCallResponse>;

  // ── Calendar ──────────────────────────────────────────────

  /**
   * List calendar events
   *
   * @example
   * ```typescript
   * const events = await client.outlook.listEvents({
   *   start_datetime: "2024-01-01T00:00:00Z",
   *   end_datetime: "2024-01-31T23:59:59Z"
   * });
   * ```
   */
  listEvents(params?: {
    /** Number of events to return */
    top?: number;
    /** Start of time range (ISO 8601) */
    start_datetime?: string;
    /** End of time range (ISO 8601) */
    end_datetime?: string;
    /** OData filter expression */
    filter?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific calendar event by ID
   *
   * @example
   * ```typescript
   * const event = await client.outlook.getEvent({ event_id: "AAMkAGI2..." });
   * ```
   */
  getEvent(params: {
    /** Event ID */
    event_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new calendar event
   *
   * @example
   * ```typescript
   * await client.outlook.createEvent({
   *   subject: "Team Sync",
   *   start: "2024-01-15T10:00:00",
   *   end: "2024-01-15T11:00:00",
   *   timezone: "America/Los_Angeles"
   * });
   * ```
   */
  createEvent(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing calendar event
   *
   * @example
   * ```typescript
   * await client.outlook.updateEvent({ event_id: "AAMkAGI2...", subject: "Updated Title" });
   * ```
   */
  updateEvent(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a calendar event
   *
   * @example
   * ```typescript
   * await client.outlook.deleteEvent({ event_id: "AAMkAGI2..." });
   * ```
   */
  deleteEvent(params: {
    /** Event ID to delete */
    event_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all calendars for the authenticated user
   *
   * @example
   * ```typescript
   * const calendars = await client.outlook.listCalendars();
   * ```
   */
  listCalendars(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  /**
   * Accept a calendar event invitation
   *
   * @example
   * ```typescript
   * await client.outlook.acceptEvent({ event_id: "AAMkAGI2...", send_response: true });
   * ```
   */
  acceptEvent(params: {
    /** Event ID to accept */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Decline a calendar event invitation
   *
   * @example
   * ```typescript
   * await client.outlook.declineEvent({ event_id: "AAMkAGI2...", comment: "Can't make it" });
   * ```
   */
  declineEvent(params: {
    /** Event ID to decline */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Tentatively accept a calendar event invitation
   *
   * @example
   * ```typescript
   * await client.outlook.tentativelyAcceptEvent({ event_id: "AAMkAGI2..." });
   * ```
   */
  tentativelyAcceptEvent(params: {
    /** Event ID to tentatively accept */
    event_id: string;
    /** Optional response comment */
    comment?: string;
    /** Whether to send a response email to the organizer */
    send_response?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Find available meeting times for a set of attendees
   *
   * @example
   * ```typescript
   * const suggestions = await client.outlook.findMeetingTimes({
   *   attendees: "alice@example.com,bob@example.com",
   *   duration_minutes: 60
   * });
   * ```
   */
  findMeetingTimes(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get free/busy schedule for a set of users or resources
   *
   * @example
   * ```typescript
   * const schedule = await client.outlook.getSchedule({
   *   schedules: "alice@example.com,bob@example.com",
   *   start_time: "2024-01-15T08:00:00",
   *   end_time: "2024-01-15T18:00:00"
   * });
   * ```
   */
  getSchedule(params: {
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
  }): Promise<MCPToolCallResponse>;

  // ── Contacts ──────────────────────────────────────────────

  /**
   * List contacts in the address book
   *
   * @example
   * ```typescript
   * const contacts = await client.outlook.listContacts({ top: 50 });
   * ```
   */
  listContacts(params?: {
    /** Number of contacts to return */
    top?: number;
    /** Number of contacts to skip */
    skip?: number;
    /** OData filter expression */
    filter?: string;
    /** OData select fields */
    select?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific contact by ID
   *
   * @example
   * ```typescript
   * const contact = await client.outlook.getContact({ contact_id: "AAMkAGI2..." });
   * ```
   */
  getContact(params: {
    /** Contact ID */
    contact_id: string;
  }): Promise<MCPToolCallResponse>;
}
