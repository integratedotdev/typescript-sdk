import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FedexIntegrationClient {
  trackShipments(params: { tracking_json: string }): Promise<MCPToolCallResponse>;
  rateShipment(params: { rate_json: string }): Promise<MCPToolCallResponse>;
  createShipment(params: { shipment_json: string }): Promise<MCPToolCallResponse>;
  cancelShipment(params: { cancel_json: string }): Promise<MCPToolCallResponse>;
  validateAddress(params: { address_json: string }): Promise<MCPToolCallResponse>;
}
