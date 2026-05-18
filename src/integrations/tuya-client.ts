import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TuyaIntegrationClient {
  listDevices(params: { user_id: string }): Promise<MCPToolCallResponse>;
  getDevice(params: { device_id: string }): Promise<MCPToolCallResponse>;
  getDeviceStatus(params: { device_id: string }): Promise<MCPToolCallResponse>;
  sendDeviceCommands(params: { device_id: string; commands_json: string }): Promise<MCPToolCallResponse>;
  listScenes(params: { home_id: string }): Promise<MCPToolCallResponse>;
}
