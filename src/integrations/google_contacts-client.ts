import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GoogleContactsIntegrationClient {
  batchGetContacts(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  copyOtherContact(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createContact(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteContact(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getPerson(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getSelf(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listConnections(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listOtherContacts(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  searchContacts(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateContact(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
