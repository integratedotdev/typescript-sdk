import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface CanvasLmsIntegrationClient {
  listCourses(params: { "enrollment_state"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }): Promise<MCPToolCallResponse>;
  getCourse(params: { course_id: string; canvas_domain: string }): Promise<MCPToolCallResponse>;
  listAssignments(params: { course_id: string; "bucket"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }): Promise<MCPToolCallResponse>;
  createAssignment(params: { course_id: string; assignment_json: string; canvas_domain: string }): Promise<MCPToolCallResponse>;
  listSubmissions(params: { course_id: string; assignment_id: string; "per_page"?: number; "page"?: number; canvas_domain: string }): Promise<MCPToolCallResponse>;
  listUsers(params: { course_id: string; "enrollment_type"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }): Promise<MCPToolCallResponse>;
}
