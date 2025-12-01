/**
 * Outlook Integration Client Types
 * Fully typed interface for Microsoft Outlook integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Outlook Message
 */
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
  conversationIndex?: string;
  isDeliveryReceiptRequested?: boolean;
  isReadReceiptRequested?: boolean;
  isRead?: boolean;
  isDraft?: boolean;
  webLink?: string;
  body?: {
    contentType: "text" | "html";
    content: string;
  };
  sender?: {
    emailAddress: {
      name?: string;
      address: string;
    };
  };
  from?: {
    emailAddress: {
      name?: string;
      address: string;
    };
  };
  toRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  ccRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  bccRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  replyTo?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  flag?: {
    flagStatus: "notFlagged" | "complete" | "flagged";
  };
}

/**
 * Outlook Event
 */
export interface OutlookEvent {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  subject?: string;
  bodyPreview?: string;
  body?: {
    contentType: "text" | "html";
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName?: string;
    locationType?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      countryOrRegion?: string;
      postalCode?: string;
    };
  };
  isAllDay?: boolean;
  isCancelled?: boolean;
  isOrganizer?: boolean;
  recurrence?: {
    pattern: {
      type: "daily" | "weekly" | "absoluteMonthly" | "relativeMonthly" | "absoluteYearly" | "relativeYearly";
      interval: number;
      month?: number;
      dayOfMonth?: number;
      daysOfWeek?: string[];
      firstDayOfWeek?: string;
      index?: "first" | "second" | "third" | "fourth" | "last";
    };
    range: {
      type: "endDate" | "noEnd" | "numbered";
      startDate: string;
      endDate?: string;
      numberOfOccurrences?: number;
    };
  };
  attendees?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
    type: "required" | "optional" | "resource";
    status?: {
      response: "none" | "organizer" | "tentativelyAccepted" | "accepted" | "declined" | "notResponded";
      time?: string;
    };
  }>;
  organizer?: {
    emailAddress: {
      name?: string;
      address: string;
    };
  };
  webLink?: string;
  onlineMeetingUrl?: string;
  showAs?: "free" | "tentative" | "busy" | "oof" | "workingElsewhere" | "unknown";
  importance?: "low" | "normal" | "high";
  sensitivity?: "normal" | "personal" | "private" | "confidential";
}

/**
 * Outlook Contact
 */
export interface OutlookContact {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  middleName?: string;
  nickName?: string;
  title?: string;
  yomiGivenName?: string;
  yomiSurname?: string;
  yomiCompanyName?: string;
  generation?: string;
  imAddresses?: string[];
  jobTitle?: string;
  companyName?: string;
  department?: string;
  officeLocation?: string;
  profession?: string;
  businessHomePage?: string;
  assistantName?: string;
  manager?: string;
  homePhones?: string[];
  mobilePhone?: string;
  businessPhones?: string[];
  spouseName?: string;
  personalNotes?: string;
  children?: string[];
  emailAddresses?: Array<{
    name?: string;
    address: string;
  }>;
  homeAddress?: {
    street?: string;
    city?: string;
    state?: string;
    countryOrRegion?: string;
    postalCode?: string;
  };
  businessAddress?: {
    street?: string;
    city?: string;
    state?: string;
    countryOrRegion?: string;
    postalCode?: string;
  };
  otherAddress?: {
    street?: string;
    city?: string;
    state?: string;
    countryOrRegion?: string;
    postalCode?: string;
  };
  birthday?: string;
}

/**
 * Outlook Integration Client Interface
 * Provides type-safe methods for all Outlook operations
 */
export interface OutlookIntegrationClient {
  /**
   * List messages in the mailbox
   * 
   * @example
   * ```typescript
   * const messages = await client.outlook.listMessages({
   *   top: 25,
   *   filter: "isRead eq false"
   * });
   * ```
   */
  listMessages(params?: {
    /** Number of messages to return */
    top?: number;
    /** Number of messages to skip */
    skip?: number;
    /** OData filter query */
    filter?: string;
    /** OData orderby query */
    orderby?: string;
    /** OData select query */
    select?: string;
    /** Folder ID (default: inbox) */
    folderId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific message
   * 
   * @example
   * ```typescript
   * const message = await client.outlook.getMessage({
   *   messageId: "AAMkAGI2..."
   * });
   * ```
   */
  getMessage(params: {
    /** Message ID */
    messageId: string;
    /** OData select query */
    select?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a new message
   * 
   * @example
   * ```typescript
   * await client.outlook.sendMessage({
   *   subject: "Hello",
   *   body: "This is the message body",
   *   toRecipients: ["recipient@example.com"]
   * });
   * ```
   */
  sendMessage(params: {
    /** Email subject */
    subject: string;
    /** Email body */
    body: string;
    /** Body content type */
    bodyContentType?: "text" | "html";
    /** To recipients (email addresses) */
    toRecipients: string[];
    /** CC recipients */
    ccRecipients?: string[];
    /** BCC recipients */
    bccRecipients?: string[];
    /** Importance level */
    importance?: "low" | "normal" | "high";
    /** Whether to save to sent items */
    saveToSentItems?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * List calendar events
   * 
   * @example
   * ```typescript
   * const events = await client.outlook.listEvents({
   *   startDateTime: "2024-01-01T00:00:00Z",
   *   endDateTime: "2024-01-31T23:59:59Z"
   * });
   * ```
   */
  listEvents(params?: {
    /** Start of time range (ISO 8601) */
    startDateTime?: string;
    /** End of time range (ISO 8601) */
    endDateTime?: string;
    /** Number of events to return */
    top?: number;
    /** Number of events to skip */
    skip?: number;
    /** OData filter query */
    filter?: string;
    /** OData orderby query */
    orderby?: string;
    /** OData select query */
    select?: string;
    /** Calendar ID (default: primary) */
    calendarId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific event
   * 
   * @example
   * ```typescript
   * const event = await client.outlook.getEvent({
   *   eventId: "AAMkAGI2..."
   * });
   * ```
   */
  getEvent(params: {
    /** Event ID */
    eventId: string;
    /** OData select query */
    select?: string;
    /** Calendar ID (default: primary) */
    calendarId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new calendar event
   * 
   * @example
   * ```typescript
   * const event = await client.outlook.createEvent({
   *   subject: "Team Meeting",
   *   start: { dateTime: "2024-01-15T10:00:00", timeZone: "America/Los_Angeles" },
   *   end: { dateTime: "2024-01-15T11:00:00", timeZone: "America/Los_Angeles" }
   * });
   * ```
   */
  createEvent(params: {
    /** Event subject */
    subject: string;
    /** Event body/description */
    body?: string;
    /** Body content type */
    bodyContentType?: "text" | "html";
    /** Event start */
    start: {
      dateTime: string;
      timeZone: string;
    };
    /** Event end */
    end: {
      dateTime: string;
      timeZone: string;
    };
    /** Event location */
    location?: string;
    /** Whether it's an all-day event */
    isAllDay?: boolean;
    /** Attendees (email addresses) */
    attendees?: string[];
    /** Whether to request responses */
    responseRequested?: boolean;
    /** Show as status */
    showAs?: "free" | "tentative" | "busy" | "oof" | "workingElsewhere";
    /** Calendar ID (default: primary) */
    calendarId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List contacts
   * 
   * @example
   * ```typescript
   * const contacts = await client.outlook.listContacts({
   *   top: 50
   * });
   * ```
   */
  listContacts(params?: {
    /** Number of contacts to return */
    top?: number;
    /** Number of contacts to skip */
    skip?: number;
    /** OData filter query */
    filter?: string;
    /** OData orderby query */
    orderby?: string;
    /** OData select query */
    select?: string;
    /** Contact folder ID */
    folderId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific contact
   * 
   * @example
   * ```typescript
   * const contact = await client.outlook.getContact({
   *   contactId: "AAMkAGI2..."
   * });
   * ```
   */
  getContact(params: {
    /** Contact ID */
    contactId: string;
    /** OData select query */
    select?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Search across messages, events, and contacts
   * 
   * @example
   * ```typescript
   * const results = await client.outlook.search({
   *   query: "important meeting",
   *   entityTypes: ["message", "event"]
   * });
   * ```
   */
  search(params: {
    /** Search query */
    query: string;
    /** Entity types to search */
    entityTypes?: Array<"message" | "event" | "contact">;
    /** Maximum results per entity type */
    size?: number;
    /** Start index for pagination */
    from?: number;
  }): Promise<MCPToolCallResponse>;
}

