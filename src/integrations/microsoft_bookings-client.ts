import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MicrosoftBookingsIntegrationClient {
  listBusinesses(params: {
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  getBusiness(params: {
    "business_id": string;
  }): Promise<MCPToolCallResponse>;
  listServices(params: {
    "business_id": string;
  }): Promise<MCPToolCallResponse>;
  listStaffMembers(params: {
    "business_id": string;
  }): Promise<MCPToolCallResponse>;
  listAppointments(params: {
    "business_id": string;
    "$top"?: number;
    "$skip"?: number;
  }): Promise<MCPToolCallResponse>;
  createAppointment(params: {
    "business_id": string;
    "appointment_json": string;
  }): Promise<MCPToolCallResponse>;
}
