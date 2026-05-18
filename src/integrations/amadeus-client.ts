import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AmadeusIntegrationClient {
  searchFlights(params: { "originLocationCode"?: string; "destinationLocationCode"?: string; "departureDate"?: string; "returnDate"?: string; "adults"?: string; "max"?: number }): Promise<MCPToolCallResponse>;
  priceFlight(params: { pricing_json: string }): Promise<MCPToolCallResponse>;
  searchHotels(params: { "cityCode"?: string; "radius"?: string; "radiusUnit"?: string; "hotelSource"?: string }): Promise<MCPToolCallResponse>;
  getHotelOffers(params: { "hotelIds"?: string; "adults"?: string; "checkInDate"?: string; "checkOutDate"?: string }): Promise<MCPToolCallResponse>;
  searchLocations(params: { "keyword"?: string; "subType"?: string; "page[limit]"?: string }): Promise<MCPToolCallResponse>;
}
