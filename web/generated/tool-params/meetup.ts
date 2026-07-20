/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface MeetupSearchGroupsParams { "text"?: string; "location"?: string; "page"?: number }

export interface MeetupListEventsParams { urlname: string; "status"?: string; "page"?: number }

export interface MeetupGetEventParams { urlname: string; event_id: string }

export interface MeetupCreateEventParams { urlname: string; event_json: string }

export interface MeetupRsvpEventParams { urlname: string; event_id: string; rsvp_json: string }

