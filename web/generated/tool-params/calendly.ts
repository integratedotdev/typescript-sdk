/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CalendlyListEventTypesParams {
    "organization"?: string;
    "user"?: string;
    "count"?: number;
    "page_token"?: string;
  }

export interface CalendlyGetEventTypeParams {
    "event_type_uuid": string;
  }

export interface CalendlyListScheduledEventsParams {
    "organization"?: string;
    "user"?: string;
    "status"?: string;
    "invitee_email"?: string;
    "min_start_time"?: string;
    "max_start_time"?: string;
    "count"?: number;
    "page_token"?: string;
  }

export interface CalendlyGetScheduledEventParams {
    "scheduled_event_uuid": string;
  }

export interface CalendlyListScheduledEventInviteesParams {
    "scheduled_event_uuid": string;
    "count"?: number;
    "page_token"?: string;
    "email"?: string;
  }

export interface CalendlyListAvailabilitySchedulesParams {
    "user"?: string;
  }

