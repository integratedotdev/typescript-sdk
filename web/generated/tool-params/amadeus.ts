/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AmadeusSearchFlightsParams { "originLocationCode"?: string; "destinationLocationCode"?: string; "departureDate"?: string; "returnDate"?: string; "adults"?: string; "max"?: number }

export interface AmadeusPriceFlightParams { pricing_json: string }

export interface AmadeusSearchHotelsParams { "cityCode"?: string; "radius"?: string; "radiusUnit"?: string; "hotelSource"?: string }

export interface AmadeusGetHotelOffersParams { "hotelIds"?: string; "adults"?: string; "checkInDate"?: string; "checkOutDate"?: string }

export interface AmadeusSearchLocationsParams { "keyword"?: string; "subType"?: string; "page[limit]"?: string }

