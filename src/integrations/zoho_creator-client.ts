import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoCreatorIntegrationClient {
  listApplications(params: {
    "account_owner": string;
  }): Promise<MCPToolCallResponse>;
  listForms(params: {
    "account_owner": string;
    "app_link_name": string;
  }): Promise<MCPToolCallResponse>;
  listReports(params: {
    "account_owner": string;
    "app_link_name": string;
  }): Promise<MCPToolCallResponse>;
  listRecords(params: {
    "account_owner": string;
    "app_link_name": string;
    "report_link_name": string;
    "page"?: number;
    "limit"?: number;
  }): Promise<MCPToolCallResponse>;
  createRecord(params: {
    "account_owner": string;
    "app_link_name": string;
    "form_link_name": string;
    "record_json": string;
  }): Promise<MCPToolCallResponse>;
  updateRecord(params: {
    "account_owner": string;
    "app_link_name": string;
    "report_link_name": string;
    "record_id": string;
    "record_json": string;
  }): Promise<MCPToolCallResponse>;
}
