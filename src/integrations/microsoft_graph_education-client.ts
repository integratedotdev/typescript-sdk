import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MicrosoftGraphEducationIntegrationClient {
  listClasses(params: { "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  getClass(params: { class_id: string }): Promise<MCPToolCallResponse>;
  listUsers(params: { "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  listAssignments(params: { class_id: string; "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  createAssignment(params: { class_id: string; assignment_json: string }): Promise<MCPToolCallResponse>;
  listSchools(params: { "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
}
