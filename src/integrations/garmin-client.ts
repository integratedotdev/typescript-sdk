import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GarminIntegrationClient {
  listActivities(params: { "uploadStartTimeInSeconds"?: string; "uploadEndTimeInSeconds"?: string }): Promise<MCPToolCallResponse>;
  listDailySummaries(params: { "uploadStartTimeInSeconds"?: string; "uploadEndTimeInSeconds"?: string }): Promise<MCPToolCallResponse>;
  listSleep(params: { "uploadStartTimeInSeconds"?: string; "uploadEndTimeInSeconds"?: string }): Promise<MCPToolCallResponse>;
  listHeartRates(params: { "uploadStartTimeInSeconds"?: string; "uploadEndTimeInSeconds"?: string }): Promise<MCPToolCallResponse>;
  listBodyComposition(params: { "uploadStartTimeInSeconds"?: string; "uploadEndTimeInSeconds"?: string }): Promise<MCPToolCallResponse>;
}
