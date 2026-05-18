import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface UpsIntegrationClient {
  trackShipment(params: { tracking_number: string; "locale"?: string }): Promise<MCPToolCallResponse>;
  rateShipment(params: { rate_json: string }): Promise<MCPToolCallResponse>;
  createShipment(params: { shipment_json: string }): Promise<MCPToolCallResponse>;
  voidShipment(params: { shipment_id: string }): Promise<MCPToolCallResponse>;
  validateAddress(params: { address_json: string }): Promise<MCPToolCallResponse>;
}
