/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BamboohrGetCompanyReportParams { report_json: string; company_domain: string }

export interface BamboohrListEmployeesParams { company_domain: string }

export interface BamboohrGetEmployeeParams { employee_id: string; company_domain: string }

export interface BamboohrUpdateEmployeeParams { employee_id: string; employee_json: string; company_domain: string }

export interface BamboohrListTimeOffRequestsParams { "start"?: string; "end"?: string; "employeeId"?: string; company_domain: string }

export interface BamboohrCreateTimeOffRequestParams { employee_id: string; request_json: string; company_domain: string }

