import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleHomeIntegrationClient {
  listDevices(params: { project_id: string }): Promise<MCPToolCallResponse>;
  getDevice(params: { project_id: string; device_id: string }): Promise<MCPToolCallResponse>;
  executeDeviceCommand(params: { project_id: string; device_id: string; command_json: string }): Promise<MCPToolCallResponse>;
  listStructures(params: { project_id: string }): Promise<MCPToolCallResponse>;
  listRooms(params: { project_id: string; structure_id: string }): Promise<MCPToolCallResponse>;
}
