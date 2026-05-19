import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoBillingIntegrationClient {
  listOrganizations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listCustomers(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  listItems(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  listSubscriptions(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  createSubscription(params: {
    "organization_id"?: string;
    "subscription_json": string;
  }): Promise<MCPToolCallResponse>;
  listInvoices(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
}
