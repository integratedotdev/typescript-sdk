import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FoursquareIntegrationClient {
  searchPlaces(params: { "query"?: string; "ll"?: string; "near"?: string; "categories"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  getPlace(params: { fsq_id: string }): Promise<MCPToolCallResponse>;
  getPlaceTips(params: { fsq_id: string; "limit"?: number; "sort"?: string }): Promise<MCPToolCallResponse>;
  getPlacePhotos(params: { fsq_id: string; "limit"?: number; "sort"?: string }): Promise<MCPToolCallResponse>;
  autocompletePlaces(params: { "query"?: string; "ll"?: string; "near"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
}
