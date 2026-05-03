import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PhantomIntegrationClient {
  buildBrowseDeeplink(params: { url: string; ref: string }): Promise<MCPToolCallResponse>;
  deeplinkProviderReference(params?: Record<string, never>): Promise<MCPToolCallResponse>;
}
