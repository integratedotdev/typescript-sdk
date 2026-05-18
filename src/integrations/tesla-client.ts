import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TeslaIntegrationClient {
  listVehicles(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getVehicle(params: { vehicle_id: string; "endpoints"?: string }): Promise<MCPToolCallResponse>;
  wakeVehicle(params: { vehicle_id: string }): Promise<MCPToolCallResponse>;
  sendVehicleCommand(params: { vehicle_id: string; command_name: string; command_json: string }): Promise<MCPToolCallResponse>;
  listEnergySites(params: Record<string, never>): Promise<MCPToolCallResponse>;
}
