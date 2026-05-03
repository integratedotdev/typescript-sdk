import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface RedditIntegrationClient {
  [method: string]: (params?: Record<string, unknown>) => Promise<MCPToolCallResponse>;
}
