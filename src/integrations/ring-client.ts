import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface RingIntegrationClient {
  listLocations(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listDevices(params: { location_id: string }): Promise<MCPToolCallResponse>;
  getDeviceHealth(params: { device_id: string }): Promise<MCPToolCallResponse>;
  listEvents(params: { device_id: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  activateSiren(params: { device_id: string; siren_json: string }): Promise<MCPToolCallResponse>;
}
