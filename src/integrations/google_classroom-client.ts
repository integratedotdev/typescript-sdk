import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleClassroomIntegrationClient {
  listCourses(params: { "pageSize"?: number; "pageToken"?: string; "teacherId"?: string; "studentId"?: string }): Promise<MCPToolCallResponse>;
  getCourse(params: { course_id: string }): Promise<MCPToolCallResponse>;
  createCourse(params: { course_json: string }): Promise<MCPToolCallResponse>;
  listCoursework(params: { course_id: string; "pageSize"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
  createCoursework(params: { course_id: string; coursework_json: string }): Promise<MCPToolCallResponse>;
  listStudents(params: { course_id: string; "pageSize"?: number; "pageToken"?: string }): Promise<MCPToolCallResponse>;
}
