import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ResendIntegrationClient {
  [method: string]: (params?: Record<string, unknown>) => Promise<MCPToolCallResponse>;
}
