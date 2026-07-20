/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ExpediaSearchPropertiesParams { "checkin"?: string; "checkout"?: string; "currency"?: string; "language"?: string; "occupancy"?: string; "property_id"?: string }

export interface ExpediaGetPropertyContentParams { "language"?: string; "property_id"?: string; "include"?: string }

export interface ExpediaGetRateQuoteParams { property_id: string; room_id: string; rate_id: string; "token"?: string }

export interface ExpediaCreateBookingParams { booking_json: string }

export interface ExpediaGetItineraryParams { itinerary_id: string; "email"?: string }

