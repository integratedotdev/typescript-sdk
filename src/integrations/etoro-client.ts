import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface EtoroIntegrationClient {
  getIdentity(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getPortfolio(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  searchInstruments(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getInstrumentRates(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listTradeHistory(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listWatchlists(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
