import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PlanetScaleIntegrationClient {
  [method: string]: (params?: Record<string, unknown>) => Promise<MCPToolCallResponse>;
}
