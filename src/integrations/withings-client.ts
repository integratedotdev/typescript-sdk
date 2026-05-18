import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WithingsIntegrationClient {
  getMeasurements(params: { "action"?: string; "meastype"?: string; "category"?: string; "startdate"?: string; "enddate"?: string }): Promise<MCPToolCallResponse>;
  getActivity(params: { "action"?: string; "startdateymd"?: string; "enddateymd"?: string }): Promise<MCPToolCallResponse>;
  getSleep(params: { "action"?: string; "startdate"?: string; "enddate"?: string }): Promise<MCPToolCallResponse>;
  getWorkouts(params: { "action"?: string; "startdateymd"?: string; "enddateymd"?: string }): Promise<MCPToolCallResponse>;
  getUser(params: { "action"?: string }): Promise<MCPToolCallResponse>;
}
