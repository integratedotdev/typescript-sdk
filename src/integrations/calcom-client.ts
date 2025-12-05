/**
 * Cal.com Integration Client Types
 * Fully typed interface for Cal.com integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Cal.com Booking
 */
export interface CalcomBooking {
  id: number;
  uid: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    email: string;
    name: string;
    timeZone: string;
    locale?: string;
  }>;
  user?: {
    id: number;
    email: string;
    name: string;
    timeZone: string;
  };
  eventType: {
    id: number;
    title: string;
    slug: string;
    length: number;
  };
  status: "accepted" | "pending" | "cancelled" | "rejected";
  paid?: boolean;
  payment?: Array<{
    id: number;
    success: boolean;
    amount: number;
    currency: string;
  }>;
  metadata?: Record<string, any>;
  location?: string;
  cancellationReason?: string;
  rescheduled?: boolean;
  fromReschedule?: string;
  recurringEventId?: string;
  responses?: Record<string, any>;
}

/**
 * Cal.com Event Type
 */
export interface CalcomEventType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  length: number;
  hidden: boolean;
  position: number;
  teamId?: number;
  eventName?: string;
  timeZone?: string;
  periodType?: "UNLIMITED" | "ROLLING" | "RANGE";
  periodStartDate?: string;
  periodEndDate?: string;
  periodDays?: number;
  periodCountCalendarDays?: boolean;
  requiresConfirmation?: boolean;
  recurringEvent?: {
    freq: number;
    count: number;
    interval: number;
  };
  disableGuests?: boolean;
  hideCalendarNotes?: boolean;
  minimumBookingNotice?: number;
  beforeEventBuffer?: number;
  afterEventBuffer?: number;
  seatsPerTimeSlot?: number;
  schedulingType?: "ROUND_ROBIN" | "COLLECTIVE";
  schedule?: {
    id: number;
    name: string;
    timeZone: string;
  };
  price?: number;
  currency?: string;
  slotInterval?: number;
  metadata?: Record<string, any>;
  successRedirectUrl?: string;
  locations?: Array<{
    type: string;
    address?: string;
    link?: string;
  }>;
}

/**
 * Cal.com Schedule
 */
export interface CalcomSchedule {
  id: number;
  name: string;
  isDefault: boolean;
  availability: Array<{
    id: number;
    days: number[];
    startTime: string;
    endTime: string;
    date?: string;
  }>;
  timeZone: string;
}

/**
 * Cal.com Availability
 */
export interface CalcomAvailability {
  busy: Array<{
    start: string;
    end: string;
  }>;
  timeZone: string;
  workingHours: Array<{
    days: number[];
    startTime: number;
    endTime: number;
  }>;
  dateOverrides: Array<{
    date: string;
    startTime: number;
    endTime: number;
  }>;
  currentSeats?: number;
}

/**
 * Cal.com User
 */
export interface CalcomUser {
  id: number;
  username?: string;
  name: string;
  email: string;
  emailVerified?: string;
  bio?: string;
  avatar?: string;
  timeZone: string;
  weekStart: string;
  createdDate: string;
  verified?: boolean;
  locale?: string;
  timeFormat?: number;
  hideBranding?: boolean;
  theme?: string;
  brandColor?: string;
  darkBrandColor?: string;
  allowDynamicBooking?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Cal.com Integration Client Interface
 * Provides type-safe methods for all Cal.com operations
 */
export interface CalcomIntegrationClient {
  /**
   * List all bookings
   * 
   * @example
   * ```typescript
   * const bookings = await client.calcom.listBookings({
   *   status: "accepted",
   *   take: 50
   * });
   * ```
   */
  listBookings(params?: {
    /** Filter by status */
    status?: "accepted" | "pending" | "cancelled" | "rejected";
    /** Filter by attendee email */
    attendeeEmail?: string;
    /** Filter by event type ID */
    eventTypeId?: number;
    /** Number of bookings to return */
    take?: number;
    /** Number of bookings to skip */
    skip?: number;
    /** Filter bookings after this date (ISO 8601) */
    afterStart?: string;
    /** Filter bookings before this date (ISO 8601) */
    beforeEnd?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get booking details
   * 
   * @example
   * ```typescript
   * const booking = await client.calcom.getBooking({
   *   uid: "booking-uid-here"
   * });
   * ```
   */
  getBooking(params: {
    /** Booking UID */
    uid: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new booking
   * 
   * @example
   * ```typescript
   * const booking = await client.calcom.createBooking({
   *   eventTypeId: 123,
   *   start: "2024-01-15T10:00:00Z",
   *   responses: {
   *     name: "John Doe",
   *     email: "john@example.com",
   *     location: { value: "inPerson", optionValue: "" }
   *   },
   *   timeZone: "America/New_York"
   * });
   * ```
   */
  createBooking(params: {
    /** Event type ID */
    eventTypeId: number;
    /** Start time (ISO 8601) */
    start: string;
    /** Booking responses (name, email, etc.) */
    responses: {
      name: string;
      email: string;
      location?: {
        value: string;
        optionValue?: string;
      };
      guests?: string[];
      notes?: string;
      [key: string]: any;
    };
    /** Time zone */
    timeZone: string;
    /** Booking language */
    language?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Recurring event options */
    recurringEventId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Cancel a booking
   * 
   * @example
   * ```typescript
   * await client.calcom.cancelBooking({
   *   uid: "booking-uid-here",
   *   cancellationReason: "Schedule conflict"
   * });
   * ```
   */
  cancelBooking(params: {
    /** Booking UID */
    uid: string;
    /** Cancellation reason (optional) */
    cancellationReason?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reschedule a booking
   * 
   * @example
   * ```typescript
   * const rescheduled = await client.calcom.rescheduleBooking({
   *   uid: "booking-uid-here",
   *   start: "2024-01-16T14:00:00Z",
   *   rescheduleReason: "Need to move meeting"
   * });
   * ```
   */
  rescheduleBooking(params: {
    /** Booking UID */
    uid: string;
    /** New start time (ISO 8601) */
    start: string;
    /** Reschedule reason (optional) */
    rescheduleReason?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List event types
   * 
   * @example
   * ```typescript
   * const eventTypes = await client.calcom.listEventTypes({
   *   take: 50
   * });
   * ```
   */
  listEventTypes(params?: {
    /** Number of event types to return */
    take?: number;
    /** Number of event types to skip */
    skip?: number;
    /** Filter by username */
    username?: string;
    /** Filter by team slug */
    teamSlug?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get availability slots
   * 
   * @example
   * ```typescript
   * const availability = await client.calcom.getAvailability({
   *   eventTypeId: 123,
   *   startTime: "2024-01-15T00:00:00Z",
   *   endTime: "2024-01-22T23:59:59Z",
   *   timeZone: "America/New_York"
   * });
   * ```
   */
  getAvailability(params: {
    /** Event type ID or slug */
    eventTypeId?: number;
    eventTypeSlug?: string;
    /** Start time for availability check (ISO 8601) */
    startTime: string;
    /** End time for availability check (ISO 8601) */
    endTime: string;
    /** Time zone */
    timeZone?: string;
    /** Username (for personal event types) */
    username?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List schedules
   * 
   * @example
   * ```typescript
   * const schedules = await client.calcom.listSchedules();
   * ```
   */
  listSchedules(params?: {
    /** Number of schedules to return */
    take?: number;
    /** Number of schedules to skip */
    skip?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get current user info
   * 
   * @example
   * ```typescript
   * const user = await client.calcom.getMe();
   * ```
   */
  getMe(): Promise<MCPToolCallResponse>;
}
