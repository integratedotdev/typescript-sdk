import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface NetatmoIntegrationClient {
  getHomesdata(params: { "home_id"?: string; "gateway_types"?: string }): Promise<MCPToolCallResponse>;
  getStationsdata(params: { "device_id"?: string; "get_favorites"?: boolean }): Promise<MCPToolCallResponse>;
  getMeasure(params: { "device_id"?: string; "module_id"?: string; "scale"?: string; "type"?: string; "date_begin"?: string; "date_end"?: string }): Promise<MCPToolCallResponse>;
  setThermpoint(params: { setpoint_json: string }): Promise<MCPToolCallResponse>;
  getEvents(params: { "home_id"?: string; "person_id"?: string; "event_id"?: string; "size"?: string }): Promise<MCPToolCallResponse>;
}
