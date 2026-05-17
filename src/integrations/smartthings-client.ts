import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SmartThingsIntegrationClient {
  listLocations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getLocation(params: { location_id: string }): Promise<MCPToolCallResponse>;
  listRooms(params: { location_id: string }): Promise<MCPToolCallResponse>;
  getRoom(params: { location_id: string; room_id: string }): Promise<MCPToolCallResponse>;
  listDevices(params?: { locationId?: string; roomId?: string; capability?: string; deviceId?: string }): Promise<MCPToolCallResponse>;
  getDevice(params: { device_id: string }): Promise<MCPToolCallResponse>;
  getDeviceStatus(params: { device_id: string }): Promise<MCPToolCallResponse>;
  executeDeviceCommand(params: { device_id: string; commands_json: string }): Promise<MCPToolCallResponse>;
  listScenes(params?: { locationId?: string }): Promise<MCPToolCallResponse>;
  executeScene(params: { scene_id: string }): Promise<MCPToolCallResponse>;
  listRules(params?: { locationId?: string }): Promise<MCPToolCallResponse>;
  getRule(params: { rule_id: string; locationId?: string }): Promise<MCPToolCallResponse>;
  createRule(params: { locationId?: string; rule_json: string }): Promise<MCPToolCallResponse>;
  updateRule(params: { rule_id: string; locationId?: string; rule_json: string }): Promise<MCPToolCallResponse>;
  deleteRule(params: { rule_id: string; locationId?: string }): Promise<MCPToolCallResponse>;
}

