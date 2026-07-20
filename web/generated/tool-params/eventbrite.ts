/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface EventbriteListEventsParams { organization_id: string; "status"?: string; "page"?: number }

export interface EventbriteGetEventParams { event_id: string }

export interface EventbriteCreateEventParams { organization_id: string; event_json: string }

export interface EventbriteListAttendeesParams { event_id: string; "page"?: number }

