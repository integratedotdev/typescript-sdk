import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ClickUpIntegrationClient {
  [method: string]: (params?: Record<string, unknown>) => Promise<MCPToolCallResponse>;
}
