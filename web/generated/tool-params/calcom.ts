/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CalcomListBookingsParams {
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
  }

export interface CalcomGetBookingParams {
    /** Booking UID */
    uid: string;
  }

export interface CalcomCreateBookingParams {
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
  }

export interface CalcomCancelBookingParams {
    /** Booking UID */
    uid: string;
    /** Cancellation reason (optional) */
    cancellationReason?: string;
  }

export interface CalcomRescheduleBookingParams {
    /** Booking UID */
    uid: string;
    /** New start time (ISO 8601) */
    start: string;
    /** Reschedule reason (optional) */
    rescheduleReason?: string;
  }

export interface CalcomListEventTypesParams {
    /** Number of event types to return */
    take?: number;
    /** Number of event types to skip */
    skip?: number;
    /** Filter by username */
    username?: string;
    /** Filter by team slug */
    teamSlug?: string;
  }

export interface CalcomGetAvailabilityParams {
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
  }

export interface CalcomListSchedulesParams {
    /** Number of schedules to return */
    take?: number;
    /** Number of schedules to skip */
    skip?: number;
  }

export interface CalcomUpdateBookingParams {
    /** Booking ID */
    booking_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomGetBookingRecordingsParams {
    /** Booking ID */
    booking_id: string;
  }

export interface CalcomGetBookingTranscriptsParams {
    /** Booking ID */
    booking_id: string;
  }

export interface CalcomGetEventTypeParams {
    /** Event type ID */
    event_type_id: string;
  }

export interface CalcomCreateEventTypeParams {
    /** Event type title */
    title: string;
    /** Event type slug */
    slug: string;
    /** Duration in minutes */
    length: number;
    /** Description */
    description?: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateEventTypeParams {
    /** Event type ID */
    event_type_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteEventTypeParams {
    /** Event type ID */
    event_type_id: string;
  }

export interface CalcomListTeamEventTypesParams {
    /** Team ID */
    team_id: string;
  }

export interface CalcomGetScheduleParams {
    /** Schedule ID */
    schedule_id: string;
  }

export interface CalcomCreateScheduleParams {
    /** Schedule name */
    name: string;
    /** Time zone */
    time_zone: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateScheduleParams {
    /** Schedule ID */
    schedule_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteScheduleParams {
    /** Schedule ID */
    schedule_id: string;
  }

export interface CalcomGetAvailabilityRuleParams {
    /** Availability rule ID */
    availability_id: string;
  }

export interface CalcomCreateAvailabilityRuleParams {
    /** JSON body defining the availability rule */
    body_json: string;
  }

export interface CalcomUpdateAvailabilityRuleParams {
    /** Availability rule ID */
    availability_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteAvailabilityRuleParams {
    /** Availability rule ID */
    availability_id: string;
  }

export interface CalcomGetSlotsParams {
    /** Start time (ISO 8601) */
    start_time: string;
    /** End time (ISO 8601) */
    end_time: string;
    /** Event type ID */
    event_type_id?: string;
    /** Event type slug */
    event_type_slug?: string;
    /** Comma-separated list of usernames */
    username_list?: string;
  }

export interface CalcomGetAttendeeParams {
    /** Attendee ID */
    attendee_id: string;
  }

export interface CalcomCreateAttendeeParams {
    /** Booking ID to add attendee to */
    booking_id: string;
    /** Attendee name */
    name: string;
    /** Attendee email */
    email: string;
    /** Attendee time zone */
    time_zone: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateAttendeeParams {
    /** Attendee ID */
    attendee_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteAttendeeParams {
    /** Attendee ID */
    attendee_id: string;
  }

export interface CalcomGetTeamParams {
    /** Team ID */
    team_id: string;
  }

export interface CalcomCreateTeamParams {
    /** Team name */
    name: string;
    /** Team slug */
    slug?: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateTeamParams {
    /** Team ID */
    team_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteTeamParams {
    /** Team ID */
    team_id: string;
  }

export interface CalcomGetMembershipParams {
    /** User ID */
    user_id: string;
    /** Team ID */
    team_id: string;
  }

export interface CalcomCreateMembershipParams {
    /** User ID */
    user_id: string;
    /** Team ID */
    team_id: string;
    /** Role (e.g. "MEMBER", "ADMIN", "OWNER") */
    role: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateMembershipParams {
    /** User ID */
    user_id: string;
    /** Team ID */
    team_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteMembershipParams {
    /** User ID */
    user_id: string;
    /** Team ID */
    team_id: string;
  }

export interface CalcomGetWebhookParams {
    /** Webhook ID */
    webhook_id: string;
  }

export interface CalcomCreateWebhookParams {
    /** Subscriber URL */
    subscriber_url: string;
    /** Event triggers */
    event_triggers: string[];
    /** Whether the webhook is active */
    active?: boolean;
    /** Webhook secret */
    secret?: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateWebhookParams {
    /** Webhook ID */
    webhook_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteWebhookParams {
    /** Webhook ID */
    webhook_id: string;
  }

export interface CalcomGetPaymentParams {
    /** Payment ID */
    payment_id: string;
  }

export interface CalcomGetUserParams {
    /** User ID */
    user_id: string;
  }

export interface CalcomCreateUserParams {
    /** User email */
    email: string;
    /** Username */
    username: string;
    /** User name */
    name?: string;
    /** Additional JSON body */
    body_json?: string;
  }

export interface CalcomUpdateUserParams {
    /** User ID */
    user_id: string;
    /** JSON body with fields to update */
    body_json?: string;
  }

export interface CalcomDeleteUserParams {
    /** User ID */
    user_id: string;
  }

