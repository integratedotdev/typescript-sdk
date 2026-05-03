import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ShopifyIntegrationClient {
  adminGraphql(params: { query: string; variables?: Record<string, unknown> | string; shop?: string }): Promise<MCPToolCallResponse>;
  restGet(params: { path: string; query?: string; shop?: string }): Promise<MCPToolCallResponse>;
  restPost(params: { path: string; body?: Record<string, unknown> | unknown[] | string; shop?: string }): Promise<MCPToolCallResponse>;
  restPut(params: { path: string; body: Record<string, unknown> | unknown[] | string; shop?: string }): Promise<MCPToolCallResponse>;
  restDelete(params: { path: string; shop?: string }): Promise<MCPToolCallResponse>;
  getShop(params?: { shop?: string }): Promise<MCPToolCallResponse>;
}
