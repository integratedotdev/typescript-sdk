/**
 * Salesforce integration client — typed wrappers for MCP tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SalesforceIntegrationClient {
  query(params: {
    q: string;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;

  getLimits(params?: { instance_url?: string }): Promise<MCPToolCallResponse>;

  describeGlobal(params?: { instance_url?: string }): Promise<MCPToolCallResponse>;

  sobjectDescribe(params: {
    sobject_type: string;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;

  sobjectGet(params: {
    sobject_type: string;
    record_id: string;
    fields?: string;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;

  sobjectCreate(params: {
    sobject_type: string;
    fields: Record<string, unknown>;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;

  sobjectUpdate(params: {
    sobject_type: string;
    record_id: string;
    fields: Record<string, unknown>;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;

  sobjectDelete(params: {
    sobject_type: string;
    record_id: string;
    instance_url?: string;
  }): Promise<MCPToolCallResponse>;
}
