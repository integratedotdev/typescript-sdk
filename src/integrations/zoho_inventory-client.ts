import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoInventoryIntegrationClient {
  listOrganizations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listContacts(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  listItems(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  listSalesOrders(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
  createSalesOrder(params: {
    "organization_id"?: string;
    "sales_order_json": string;
  }): Promise<MCPToolCallResponse>;
  listPackages(params: {
    "organization_id"?: string;
    "page"?: number;
    "per_page"?: number;
  }): Promise<MCPToolCallResponse>;
}
