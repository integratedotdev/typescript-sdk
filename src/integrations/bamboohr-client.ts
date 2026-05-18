import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BamboohrIntegrationClient {
  getCompanyReport(params: { report_json: string; company_domain: string }): Promise<MCPToolCallResponse>;
  listEmployees(params: { company_domain: string }): Promise<MCPToolCallResponse>;
  getEmployee(params: { employee_id: string; company_domain: string }): Promise<MCPToolCallResponse>;
  updateEmployee(params: { employee_id: string; employee_json: string; company_domain: string }): Promise<MCPToolCallResponse>;
  listTimeOffRequests(params: { "start"?: string; "end"?: string; "employeeId"?: string; company_domain: string }): Promise<MCPToolCallResponse>;
  createTimeOffRequest(params: { employee_id: string; request_json: string; company_domain: string }): Promise<MCPToolCallResponse>;
}
