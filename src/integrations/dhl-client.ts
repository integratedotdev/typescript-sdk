import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DhlIntegrationClient {
  trackShipment(params: { "trackingNumber"?: string; "service"?: string }): Promise<MCPToolCallResponse>;
  createShipment(params: { shipment_json: string }): Promise<MCPToolCallResponse>;
  getLabel(params: { shipment_number: string }): Promise<MCPToolCallResponse>;
  deleteShipment(params: { shipment_number: string }): Promise<MCPToolCallResponse>;
  validateAddress(params: { address_json: string }): Promise<MCPToolCallResponse>;
}
