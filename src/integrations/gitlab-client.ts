import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GitLabIntegrationClient {
  [method: string]: (params?: Record<string, unknown>) => Promise<MCPToolCallResponse>;
}
