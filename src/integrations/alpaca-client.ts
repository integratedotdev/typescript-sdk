/**
 * Alpaca Integration Client Types
 * Typed interface for Alpaca Trading API tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AlpacaIntegrationClient {
  getAccount(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listPositions(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getPosition(params: { symbol: string }): Promise<MCPToolCallResponse>;
  listOrders(params: {
    status?: string;
    limit?: number;
    after?: string;
    until?: string;
    direction?: string;
    nested?: boolean;
    symbols?: string;
  }): Promise<MCPToolCallResponse>;
  getOrder(params: { order_id: string; nested?: boolean }): Promise<MCPToolCallResponse>;
  createOrder(params: {
    symbol: string;
    side: string;
    type: string;
    time_in_force: string;
    qty?: string;
    notional?: string;
    limit_price?: string;
    stop_price?: string;
    trail_percent?: string;
    trail_price?: string;
    extended_hours?: boolean;
    client_order_id?: string;
  }): Promise<MCPToolCallResponse>;
  cancelOrder(params: { order_id: string }): Promise<MCPToolCallResponse>;
  cancelAllOrders(params: { symbols?: string }): Promise<MCPToolCallResponse>;
  getClock(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getCalendar(params: { start: string; end: string }): Promise<MCPToolCallResponse>;
  listAssets(params: { status?: string; asset_class?: string }): Promise<MCPToolCallResponse>;
  getAsset(params: { symbol_or_id: string }): Promise<MCPToolCallResponse>;
  getPortfolioHistory(params: {
    period?: string;
    timeframe?: string;
    date_end?: string;
    extended_hours?: boolean;
  }): Promise<MCPToolCallResponse>;
}
