import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ExactOnlineIntegrationClient {
  listDivisions(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listAccounts(params: { division: string; "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  listItems(params: { division: string; "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  listSalesInvoices(params: { division: string; "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
  createSalesInvoice(params: { division: string; invoice_json: string }): Promise<MCPToolCallResponse>;
  listGlAccounts(params: { division: string; "$top"?: number; "$skip"?: string }): Promise<MCPToolCallResponse>;
}
