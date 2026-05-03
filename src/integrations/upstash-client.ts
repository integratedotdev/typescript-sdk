/**
 * Upstash Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface UpstashIntegrationClient {
  redisRun(params: { command: unknown[] }): Promise<MCPToolCallResponse>;
  redisGet(params: { key: string }): Promise<MCPToolCallResponse>;
  redisSet(params: { key: string; value: string; ex?: number }): Promise<MCPToolCallResponse>;
  redisDel(params: { keys: string }): Promise<MCPToolCallResponse>;
  qstashPublish(params: {
    destination: string;
    body?: string;
    content_type?: string;
    delay?: string;
    method?: string;
  }): Promise<MCPToolCallResponse>;
}
