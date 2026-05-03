/**
 * Workday Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WorkdayIntegrationClient {
  listWorkers(params: {
    hostname: string;
    tenant: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolCallResponse>;
  getWorker(params: { hostname: string; tenant: string; worker_id: string }): Promise<MCPToolCallResponse>;
}
