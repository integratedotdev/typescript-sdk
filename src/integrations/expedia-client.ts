import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ExpediaIntegrationClient {
  searchProperties(params: { "checkin"?: string; "checkout"?: string; "currency"?: string; "language"?: string; "occupancy"?: string; "property_id"?: string }): Promise<MCPToolCallResponse>;
  getPropertyContent(params: { "language"?: string; "property_id"?: string; "include"?: string }): Promise<MCPToolCallResponse>;
  getRateQuote(params: { property_id: string; room_id: string; rate_id: string; "token"?: string }): Promise<MCPToolCallResponse>;
  createBooking(params: { booking_json: string }): Promise<MCPToolCallResponse>;
  getItinerary(params: { itinerary_id: string; "email"?: string }): Promise<MCPToolCallResponse>;
}
