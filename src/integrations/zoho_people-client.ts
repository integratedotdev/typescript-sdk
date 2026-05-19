import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoPeopleIntegrationClient {
  listForms(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listEmployees(params: {
    "sIndex"?: number;
    "limit"?: number;
  }): Promise<MCPToolCallResponse>;
  getEmployee(params: {
    "employee_id": string;
  }): Promise<MCPToolCallResponse>;
  listAttendance(params: {
    "fromDate"?: string;
    "toDate"?: string;
  }): Promise<MCPToolCallResponse>;
  listLeaveRequests(params: {
    "fromDate"?: string;
    "toDate"?: string;
    "employeeId"?: string;
  }): Promise<MCPToolCallResponse>;
  listTimeLogs(params: {
    "fromDate"?: string;
    "toDate"?: string;
    "employeeId"?: string;
  }): Promise<MCPToolCallResponse>;
}
