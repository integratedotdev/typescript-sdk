import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface UberIntegrationClient {
  getProfile(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listProducts(params: { "latitude"?: string; "longitude"?: string }): Promise<MCPToolCallResponse>;
  estimatePrice(params: { "start_latitude"?: string; "start_longitude"?: string; "end_latitude"?: string; "end_longitude"?: string }): Promise<MCPToolCallResponse>;
  estimateTime(params: { "start_latitude"?: string; "start_longitude"?: string; "product_id"?: string }): Promise<MCPToolCallResponse>;
  listRequests(params: { "limit"?: number; "offset"?: number }): Promise<MCPToolCallResponse>;
  createRequest(params: { request_json: string }): Promise<MCPToolCallResponse>;
}
